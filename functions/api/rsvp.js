import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '../../shared/schema';

// Helper function for generating invitation codes
function generateInvitationCode() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export async function onRequestPost({ env, request }) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    const db = drizzle(env.DB, { schema });
    

    
    if (path.endsWith('/rsvp') || path.includes('/submit')) {
      // Handle POST /api/rsvp
      const body = await request.json();
      
      // Validate required fields
      if (!body.invitationCode || !body.guestName || !body.guestEmail) {
        return new Response(JSON.stringify({ error: "Missing required fields: invitationCode, guestName, guestEmail" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Get invitation details
      const invitation = await db.select()
        .from(schema.rsvpInvitations)
        .where(eq(schema.rsvpInvitations.invitationCode, body.invitationCode))
        .get();

      if (!invitation) {
        return new Response(JSON.stringify({ error: "Invalid invitation code" }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Check if already responded
      const existingRsvp = await db.select()
        .from(schema.rsvps)
        .where(eq(schema.rsvps.invitationId, invitation.id))
        .get();

      if (existingRsvp) {
        return new Response(JSON.stringify({ error: "RSVP already submitted for this invitation" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Create RSVP record
      const rsvp = await db.insert(schema.rsvps).values({
        weddingId: invitation.weddingId,
        invitationId: invitation.id,
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        attendingCeremony: body.attendingCeremony ?? true,
        attendingReception: body.attendingReception ?? true,
        numberOfGuests: body.numberOfGuests || 1,
        dietaryRestrictions: body.dietaryRestrictions,
        message: body.message,
        createdAt: new Date()
      }).returning().get();

      // Save custom question responses
      if (body.responses && typeof body.responses === 'object') {
        for (const [questionId, answer] of Object.entries(body.responses)) {
          if (answer !== null && answer !== undefined && answer !== '') {
            await db.insert(schema.rsvpResponses).values({
              rsvpId: rsvp.id,
              questionId: parseInt(questionId),
              answer: String(answer)
            });
          }
        }
      }

      // Update invitation status
      await db.update(schema.rsvpInvitations)
        .set({ status: "responded" })
        .where(eq(schema.rsvpInvitations.id, invitation.id));

      return new Response(JSON.stringify({ 
        success: true, 
        rsvp,
        message: "RSVP submitted successfully!"
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in RSVP endpoint:', error);
    return new Response(JSON.stringify({ error: "Failed to process RSVP request" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestGet({ env, request }) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    const db = drizzle(env.DB, { schema });
    
    // Handle GET /api/rsvp/manage/secret/:secret
    const manageMatch = path.match(/\/manage\/secret\/([^/]+)$/);
    if (manageMatch) {
      const secret = manageMatch[1];
      
      // Find wedding by admin secret link
      const wedding = await db.select()
        .from(schema.weddings)
        .where(eq(schema.weddings.adminSecretLink, secret))
        .get();

      if (!wedding) {
        return new Response(JSON.stringify({ error: "Wedding not found" }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Get all invitations for this wedding
      const invitations = await db.select()
        .from(schema.rsvpInvitations)
        .where(eq(schema.rsvpInvitations.weddingId, wedding.id))
        .all();

      // Get all RSVPs for this wedding
      const rsvps = await db.select()
        .from(schema.rsvps)
        .leftJoin(schema.rsvpInvitations, eq(schema.rsvps.invitationId, schema.rsvpInvitations.id))
        .where(eq(schema.rsvps.weddingId, wedding.id))
        .all();

      // Calculate statistics
      const totalInvitations = invitations.length;
      const respondedCount = rsvps.length;
      const pendingCount = totalInvitations - respondedCount;
      const attendingCount = rsvps.filter(r => r.rsvps && (r.rsvps.attendingCeremony || r.rsvps.attendingReception)).length;
      const totalGuests = rsvps.reduce((sum, r) => sum + (r.rsvps?.numberOfGuests || 1), 0);
      const responseRate = totalInvitations > 0 ? Math.round((respondedCount / totalInvitations) * 100) : 0;

      // Prepare CSV data
      const csvData = rsvps.map(r => ({
        guestName: r.rsvps?.guestName || '',
        guestEmail: r.rsvps?.guestEmail || '',
        guestPhone: r.rsvps?.guestPhone || '',
        attendingCeremony: r.rsvps?.attendingCeremony ? 'Yes' : 'No',
        attendingReception: r.rsvps?.attendingReception ? 'Yes' : 'No',
        numberOfGuests: r.rsvps?.numberOfGuests || 1,
        message: r.rsvps?.message || '',
        submittedAt: r.rsvps?.createdAt || ''
      }));

      // Format rsvp responses for the frontend
      const formattedRsvps = rsvps.map(r => ({
        id: r.rsvps?.id,
        guestName: r.rsvps?.guestName || '',
        guestEmail: r.rsvps?.guestEmail || '',
        guestPhone: r.rsvps?.guestPhone || '',
        attendingCeremony: r.rsvps?.attendingCeremony || false,
        attendingReception: r.rsvps?.attendingReception || false,
        numberOfGuests: r.rsvps?.numberOfGuests || 1,
        message: r.rsvps?.message || '',
        createdAt: r.rsvps?.createdAt || ''
      }));

      return new Response(JSON.stringify({
        wedding,
        statistics: {
          totalInvitations,
          respondedCount,
          pendingCount,
          attendingCount,
          totalGuests,
          responseRate
        },
        invitations,
        rsvpResponses: formattedRsvps,
        csvData
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Handle GET /api/rsvp/invitation/:code
    const invitationMatch = path.match(/\/invitation\/([^/]+)$/);
    if (invitationMatch) {
      const code = invitationMatch[1];
      
      // Get invitation with wedding details
      const invitation = await db.select()
        .from(schema.rsvpInvitations)
        .leftJoin(schema.weddings, eq(schema.rsvpInvitations.weddingId, schema.weddings.id))
        .where(eq(schema.rsvpInvitations.invitationCode, code))
        .get();

      if (!invitation) {
        return new Response(JSON.stringify({ error: "Invitation not found" }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Update viewed status
      await db.update(schema.rsvpInvitations)
        .set({ 
          status: "viewed",
          viewedAt: new Date()
        })
        .where(eq(schema.rsvpInvitations.invitationCode, code));

      // Get wedding events
      const events = await db.select().from(schema.weddingEvents)
        .where(eq(schema.weddingEvents.weddingId, invitation.rsvp_invitations.weddingId))
        .orderBy(schema.weddingEvents.order)
        .all();

      // Get custom questions
      const questions = await db.select().from(schema.rsvpQuestions)
        .where(eq(schema.rsvpQuestions.weddingId, invitation.rsvp_invitations.weddingId))
        .orderBy(schema.rsvpQuestions.order)
        .all();

      return new Response(JSON.stringify({ 
        invitation: invitation.rsvp_invitations,
        wedding: invitation.weddings,
        events,
        questions
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error fetching RSVP data:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch RSVP data" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}