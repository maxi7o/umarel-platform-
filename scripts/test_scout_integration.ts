
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';


dotenv.config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    dotenv.config({ path: '.env' });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runTest() {
    console.log('🚀 Starting Scout Integration Test...');

    // 1. Create a Fake High-Intent Lead
    console.log('\n1️⃣ Creating Dummy High-Intent Lead...');
    const dummyLead = {
        source: 'instagram',
        external_id: `test_post_${Date.now()}`,
        post_url: 'https://instagram.com/p/TEST_123',
        post_content: 'Necesito un albañil urgente para revocar una pared. #reformas',
        author_username: 'test_user_123',
        intent_score: 10, // Must be 9 or 10 for auto-post
        intent_reasoning: 'Explicit demand for service (simulated)',
        suggested_reply: 'Hola! En El Entendido tenemos albañiles verificados. 👷‍♂️',
        status: 'approved'
    };

    const { data: lead, error: insertError } = await supabase
        .from('scout_leads')
        .insert(dummyLead)
        .select()
        .single();

    if (insertError) {
        console.error('❌ Failed to insert lead:', insertError);
        return;
    }

    console.log('✅ Lead Created:', lead.id);

    // 2. Call the Auto-Post API
    console.log('\n2️⃣ Calling Auto-Post API...');
    const apiUrl = `${APP_URL}/api/admin/scout/auto-post`;


    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                leadId: lead.id,
                platform: lead.source,
                postUrl: lead.post_url,
                replyText: lead.suggested_reply
            })
        });

        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('❌ Failed to parse JSON response:', responseText.substring(0, 200) + '...');
            return;
        }

        if (response.ok) {
            console.log('✅ API Call Successful!');
            console.log('   Result:', JSON.stringify(result, null, 2));
        } else {
            console.error('❌ API Call Failed:', response.status, response.statusText);
            console.error('   Error:', JSON.stringify(result, null, 2));
        }

        // 3. Verify Database Update
        console.log('\n3️⃣ Verifying Database Update...');
        const { data: updatedLead } = await supabase
            .from('scout_leads')
            .select('*')
            .eq('id', lead.id)
            .single();

        if (updatedLead.status === 'auto_posted' || updatedLead.status === 'posted_manually' || updatedLead.status === 'posted') {
            console.log('✅ Lead status updated to "auto_posted"');
        } else {
            console.error('❌ Lead status mismatch:', updatedLead.status);
        }

    } catch (error: any) {
        if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
            console.warn('\n⚠️  WARNING: Could not connect to API server at ' + APP_URL);
            console.warn('   Please ensure the Next.js development server is running:');
            console.warn('   Run: npm run dev');
        } else {
            console.error('❌ Network/System Error:', error);
        }
    }
}

runTest();
