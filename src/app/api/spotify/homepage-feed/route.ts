import { NextResponse } from 'next/server';

/**
 * Fetches Spotify's homepage feed using their internal web API
 * 
 * WARNING: This uses Spotify's undocumented internal API endpoints.
 * - These endpoints are not official and may change without notice
 * - This is for educational/portfolio purposes only
 * - Not recommended for production use
 */
export async function GET() {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Spotify credentials not configured' },
        { status: 500 }
      );
    }

    // Get client credentials token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const { access_token } = await tokenResponse.json();

    // Fetch from Spotify's internal web API (used by their web client)
    // This endpoint returns the same structure as homepageData.json
    const homepageResponse = await fetch(
      'https://api.spotify.com/v1/views/desktop-home',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!homepageResponse.ok) {
      // Fallback: Try browse categories
      const categoriesResponse = await fetch(
        'https://api.spotify.com/v1/browse/categories?limit=20',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          cache: 'no-store',
        }
      );

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        
        // Transform to a simplified format
        const transformedData = {
          data: {
            home: {
              sectionContainer: {
                sections: {
                  items: [
                    {
                      data: {
                        title: {
                          transformedLabel: 'Browse All',
                        },
                      },
                      sectionItems: {
                        items: categoriesData.categories.items.map((category: any) => ({
                          content: {
                            __typename: 'CategoryResponseWrapper',
                            data: {
                              name: category.name,
                              icons: category.icons,
                            },
                          },
                        })),
                      },
                    },
                  ],
                },
              },
            },
          },
        };

        return NextResponse.json(transformedData, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          },
        });
      }

      throw new Error(`Failed to fetch homepage data: ${homepageResponse.status}`);
    }

    const data = await homepageResponse.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error: any) {

    // Return static fallback on error
    return NextResponse.json(
      {
        error: 'Failed to fetch homepage feed',
        message: 'Using fallback data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

