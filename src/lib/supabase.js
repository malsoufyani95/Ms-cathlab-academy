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
      id,
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

    return {
      id: course.id,
      slug: course.slug,
      track: trackName || course.level,
      title,
      description: summary,
      audience: course.target_audience || (lang === 'ar' ? 'فريق Cath Lab' : 'Cath Lab staff'),
      duration,
      level: course.level || 'foundation',
    };
  });
}

export async function enrollInCourse(profileId, courseId) {
  if (!supabase) throw new Error('Supabase is not configured.');
  if (!profileId || !courseId) throw new Error('Missing profile or course.');

  const { data, error } = await supabase
    .from('enrollments')
    .upsert({
      profile_id: profileId,
      course_id: courseId,
      status: 'in_progress',
      progress_percent: 0,
    }, { onConflict: 'profile_id,course_id' })
    .select('id, status, progress_percent')
    .single();

  if (error) throw error;
  return data;
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

async function countRows(table, filters = []) {
  if (!supabase) return 0;
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  filters.forEach(([column, value]) => { query = query.eq(column, value); });
  const { count, error } = await query;
  if (error) {
    console.warn(`Unable to count ${table}:`, error.message);
    return 0;
  }
  return count || 0;
}

export async function fetchDashboardSummary(profileId) {
  if (!supabase || !profileId) return null;

  const [enrollmentsResult, assessmentCount, validatedCount, certificateCount, attemptCount] = await Promise.all([
    supabase
      .from('enrollments')
      .select('id, status, progress_percent, courses(title_en, title_ar)')
      .eq('profile_id', profileId)
      .order('enrolled_at', { ascending: false }),
    countRows('competency_assessments', [['trainee_id', profileId]]),
    countRows('competency_assessments', [['trainee_id', profileId], ['status', 'validated']]),
    countRows('certificates', [['trainee_id', profileId]]),
    countRows('simulation_attempts', [['trainee_id', profileId]]),
  ]);

  if (enrollmentsResult.error) {
    console.warn('Unable to load enrollments:', enrollmentsResult.error.message);
  }

  const enrollments = enrollmentsResult.data || [];
  const averageProgress = enrollments.length
    ? Math.round(enrollments.reduce((total, row) => total + Number(row.progress_percent || 0), 0) / enrollments.length)
    : 0;

  return {
    enrollments,
    enrollmentCount: enrollments.length,
    averageProgress,
    assessmentCount,
    validatedCount,
    certificateCount,
    attemptCount,
  };
}


export async function fetchTrainerDashboardSummary(profile) {
  if (!supabase || !profile || !['trainer', 'admin'].includes(profile.role)) return null;

  const [profilesResult, enrollmentsResult, pendingAssessmentsResult, certificatesResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, role, job_title, department, active, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('enrollments')
      .select('id, status, progress_percent, enrolled_at, profiles(id, full_name, role), courses(title_en, title_ar, level)')
      .order('enrolled_at', { ascending: false }),
    supabase
      .from('competency_assessments')
      .select('id, status, evidence_note, assessed_at, profiles!competency_assessments_trainee_id_fkey(id, full_name), competencies(title_en, title_ar, code)')
      .in('status', ['pending', 'observed', 'needs_remediation'])
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('certificates')
      .select('id, certificate_number, status, issued_at, profiles!certificates_trainee_id_fkey(id, full_name), courses(title_en, title_ar)')
      .order('issued_at', { ascending: false })
      .limit(12),
  ]);

  for (const [label, result] of [['profiles', profilesResult], ['enrollments', enrollmentsResult], ['assessments', pendingAssessmentsResult], ['certificates', certificatesResult]]) {
    if (result.error) console.warn(`Unable to load trainer ${label}:`, result.error.message);
  }

  const profiles = profilesResult.data || [];
  const enrollments = enrollmentsResult.data || [];
  const pendingAssessments = pendingAssessmentsResult.data || [];
  const certificates = certificatesResult.data || [];
  const trainees = profiles.filter(row => row.role === 'trainee');
  const averageProgress = enrollments.length
    ? Math.round(enrollments.reduce((total, row) => total + Number(row.progress_percent || 0), 0) / enrollments.length)
    : 0;

  return {
    profiles,
    trainees,
    enrollments,
    pendingAssessments,
    certificates,
    traineeCount: trainees.length,
    enrollmentCount: enrollments.length,
    pendingAssessmentCount: pendingAssessments.length,
    certificateCount: certificates.length,
    averageProgress,
  };
}

export async function fetchLearningResources(lang = 'en') {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('learning_resources')
    .select(`
      id,
      title,
      description,
      resource_type,
      visibility,
      storage_bucket,
      storage_path,
      file_name,
      file_mime_type,
      file_size_bytes,
      external_url,
      created_at,
      courses (
        title_en,
        title_ar,
        slug
      ),
      profiles (
        full_name,
        role
      )
    `)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Unable to load learning resources:', error.message);
    return [];
  }

  const rows = data || [];
  const signedResults = await Promise.all(rows.map(async (resource) => {
    if (resource.external_url) return resource.external_url;
    const { data: signed, error: signedError } = await supabase
      .storage
      .from(resource.storage_bucket || 'training-files')
      .createSignedUrl(resource.storage_path, 60 * 60);
    if (signedError) {
      console.warn('Unable to sign resource URL:', signedError.message);
      return '';
    }
    return signed?.signedUrl || '';
  }));

  return rows.map((resource, index) => ({
    ...resource,
    courseTitle: lang === 'ar'
      ? resource.courses?.title_ar || resource.courses?.title_en
      : resource.courses?.title_en,
    uploadedBy: resource.profiles?.full_name || '',
    signedUrl: signedResults[index],
  }));
}

export async function uploadLearningResource({ file, title, description, courseId, resourceType, visibility, profileId }) {
  if (!supabase) throw new Error('Supabase is not configured.');
  if (!file) throw new Error('Select a training file first.');
  if (!profileId) throw new Error('Trainer/Admin profile is required.');
  if (!title?.trim()) throw new Error('Resource title is required.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'training-file';
  const path = `${profileId}/${Date.now()}-${safeName}`;
  const bucket = 'training-files';

  const { error: uploadError } = await supabase
    .storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from('learning_resources')
    .insert({
      course_id: courseId || null,
      uploaded_by: profileId,
      title: title.trim(),
      description: description?.trim() || null,
      resource_type: resourceType || 'document',
      visibility: visibility || 'trainee',
      storage_bucket: bucket,
      storage_path: path,
      file_name: file.name,
      file_mime_type: file.type || 'application/octet-stream',
      file_size_bytes: file.size || 0,
    })
    .select('id, title, storage_path')
    .single();

  if (error) throw error;
  return data;
}

