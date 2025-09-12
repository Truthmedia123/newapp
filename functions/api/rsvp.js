import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '../../shared/schema.ts';

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
    
    if (path.includes('/invitations')) {
      // Handle POST /api/rsvp/invitations
      const body = await request.json();
      
      // Validate input
      if (!Array.isArray(body) || body.length === 0) {
        return new Response(JSON.stringify({ error: "Invalid guest list" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const invitations = [];
      for (const guest of body) {
        // Validate required fields
        if (!guest.wedding_id || !guest.guest_name || !guest.guest_email) {
          return new Response(JSON.stringify({ error: "Missing required fields: wedding_id, guest_name, guest_email" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Generate unique invitation code
        const invitationCode = generateInvitationCode();
        
        const invitation = await db.insert(schema.rsvpInvitations).values({
          weddingId: guest.wedding_id,
          guestName: guest.guest_name,
          guestEmail: guest.guest_email,
          invitationCode,
          maxGuests: guest.max_guests || 1,
          allowPlusOne: guest.allow_plus_one || false,
          status: "sent",
          sentAt: new Date(),
          createdAt: new Date()
        }).returning().get();

        invitations.push({
          ...invitation,
          rsvpLink: `${url.origin}/rsvp/${invitationCode}`
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        invitations,
        message: `Generated ${invitations.length} invitation links`
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    if (path.includes('/submit')) {
      // Handle POST /api/rsvp/submit
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