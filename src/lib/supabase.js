import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export async function fetchCatalogCourses(lang = 'en') {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('courses')
    .select(`
      slug,
      title_en,
      title_ar,
      summary_en,
      summary_ar,
      target_audience,
      estimated_hours,
      level,
      sort_order,
      training_tracks (
        title_en,
        title_ar
      )
    `)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.warn('Unable to load Supabase catalog courses:', error.message);
    return [];
  }

  return (data ?? []).map((course) => {
    const track = course.training_tracks;
    const title = lang === 'ar' ? course.title_ar || course.title_en : course.title_en;
    const summary = lang === 'ar' ? course.summary_ar || course.summary_en : course.summary_en;
    const trackName = lang === 'ar' ? track?.title_ar || track?.title_en : track?.title_en;
    const hours = Number(course.estimated_hours || 0);
    const duration = lang === 'ar'
      ? `${hours || 0} ساعة`
      : `${hours || 0} hours`;

    return [
      trackName || course.level,
      title,
      summary,
      course.target_audience || (lang === 'ar' ? 'فريق Cath Lab' : 'Cath Lab staff'),
      duration,
    ];
  });
}
