import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auto-Poster Service
 * Posts approved replies to social media platforms
 * Called by n8n workflow for high-confidence leads (score 9-10)
 */

interface PostRequest {
    leadId: string;
    platform: 'instagram' | 'facebook' | 'twitter';
    postUrl: string;
    replyText: string;
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    try {
        const body: PostRequest = await req.json();
        const { leadId, platform, postUrl, replyText } = body;

        // Verify this is a high-confidence lead
        const { data: lead, error: fetchError } = await supabase
            .from('scout_leads')
            .select('*')
            .eq('id', leadId)
            .single();

        if (fetchError || !lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        if (lead.intent_score < 9) {
            return NextResponse.json({
                error: 'Auto-post only allowed for score 9-10',
                requiresReview: true
            }, { status: 400 });
        }

        // Platform-specific posting logic
        let postResult;

        switch (platform) {
            case 'instagram':
                postResult = await postToInstagram(postUrl, replyText);
                break;
            case 'facebook':
                postResult = await postToFacebook(postUrl, replyText);
                break;
            case 'twitter':
                postResult = await postToTwitter(postUrl, replyText);
                break;
            default:
                return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
        }

        // Update lead status
        // Update lead status
        const { error: updateError } = await supabase
            .from('scout_leads')
            .update({
                status: 'auto_posted',
                posted_at: new Date().toISOString(),
                raw_data: postResult // Storing engagement result in raw_data
            })
            .eq('id', leadId);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            posted: true,
            result: postResult
        });

    } catch (error) {
        console.error('Auto-post error:', error);
        return NextResponse.json({
            error: 'Failed to post',
            details: String(error)
        }, { status: 500 });
    }
}

/**
 * Instagram posting via Meta Graph API
 * Requires: Instagram Business Account + Meta App
 */
async function postToInstagram(postUrl: string, replyText: string) {
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
        console.warn('META_ACCESS_TOKEN not set - simulating Instagram post');
        return { simulated: true, platform: 'instagram' };
    }

    // Extract media ID from URL
    const mediaId = extractInstagramMediaId(postUrl);

    // Post comment via Graph API
    const response = await fetch(
        `https://graph.facebook.com/v18.0/${mediaId}/comments`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_token: accessToken,
                message: replyText
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Instagram API error: ${JSON.stringify(data)}`);
    }

    return {
        platform: 'instagram',
        commentId: data.id,
        posted: true
    };
}

/**
 * Facebook posting via Graph API
 */
async function postToFacebook(postUrl: string, replyText: string) {
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
        console.warn('META_ACCESS_TOKEN not set - simulating Facebook post');
        return { simulated: true, platform: 'facebook' };
    }

    // Extract post ID from URL
    const postId = extractFacebookPostId(postUrl);

    const response = await fetch(
        `https://graph.facebook.com/v18.0/${postId}/comments`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_token: accessToken,
                message: replyText
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Facebook API error: ${JSON.stringify(data)}`);
    }

    return {
        platform: 'facebook',
        commentId: data.id,
        posted: true
    };
}

/**
 * Twitter/X posting via API v2
 */
async function postToTwitter(postUrl: string, replyText: string) {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!bearerToken) {
        console.warn('TWITTER_BEARER_TOKEN not set - simulating Twitter post');
        return { simulated: true, platform: 'twitter' };
    }

    // Extract tweet ID from URL
    const tweetId = extractTwitterTweetId(postUrl);

    const response = await fetch(
        'https://api.twitter.com/2/tweets',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: replyText,
                reply: {
                    in_reply_to_tweet_id: tweetId
                }
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Twitter API error: ${JSON.stringify(data)}`);
    }

    return {
        platform: 'twitter',
        tweetId: data.data.id,
        posted: true
    };
}

// Helper functions to extract IDs from URLs
function extractInstagramMediaId(url: string): string {
    // Example: https://instagram.com/p/ABC123/ -> ABC123
    const match = url.match(/\/p\/([^\/]+)/);
    return match ? match[1] : '';
}

function extractFacebookPostId(url: string): string {
    // Example: https://facebook.com/groups/123/posts/456 -> 456
    const match = url.match(/posts\/(\d+)/);
    return match ? match[1] : '';
}

function extractTwitterTweetId(url: string): string {
    // Example: https://twitter.com/user/status/123456 -> 123456
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : '';
}
