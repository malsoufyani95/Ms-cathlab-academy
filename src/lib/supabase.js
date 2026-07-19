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

export async function getCurrentSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Unable to read Supabase session:', error.message);
    return null;
  }
  return data.session;
}

export function subscribeToAuthChanges(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signInWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await ensureProfile(data.user);
  return data;
}

export async function signUpWithEmail(email, password, fullName = '') {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || email.split('@')[0] },
    },
  });
  if (error) throw error;
  if (data.user) await ensureProfile(data.user, fullName);
  return data;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchCurrentProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, auth_user_id, staff_id, full_name, email, role, job_title, department')
    .eq('auth_user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Unable to load Supabase profile:', error.message);
    return null;
  }
  return data;
}

export async function ensureProfile(user, fullName = '') {
  if (!supabase || !user) return null;

  const existing = await fetchCurrentProfile(user.id);
  if (existing) return existing;

  const profile = {
    auth_user_id: user.id,
    full_name: fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Cath Lab Trainee',
    email: user.email,
    role: 'trainee',
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select('id, auth_user_id, staff_id, full_name, email, role, job_title, department')
    .single();

  if (error) {
    console.warn('Unable to create Supabase profile:', error.message);
    return null;
  }
  return data;
}
