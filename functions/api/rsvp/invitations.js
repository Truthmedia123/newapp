import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '../../../shared/schema.ts';

// Helper function for generating invitation codes
function generateInvitationCode() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export async function onRequestPost({ env, request }) {
  try {
    const url = new URL(request.url);
    const db = drizzle(env.DB, { schema });
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
    
  } catch (error) {
    console.error('Error creating invitations:', error);
    return new Response(JSON.stringify({ error: "Failed to create invitations" }), {
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