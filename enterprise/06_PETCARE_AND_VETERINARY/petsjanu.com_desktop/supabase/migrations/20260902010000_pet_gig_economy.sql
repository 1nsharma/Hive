-- PetJanu local-services / gig economy.
-- Jobs are assigned only after the worker has an approved profile.

CREATE TABLE IF NOT EXISTS public.gig_worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 80),
  bio TEXT,
  service_categories TEXT[] NOT NULL DEFAULT '{}',
  service_areas TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate NUMERIC(10,2) CHECK (hourly_rate >= 0),
  identity_status TEXT NOT NULL DEFAULT 'pending' CHECK (identity_status IN ('pending', 'verified', 'rejected', 'suspended')),
  background_check_status TEXT NOT NULL DEFAULT 'not_started' CHECK (background_check_status IN ('not_started', 'pending', 'cleared', 'failed')),
  rating NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  completed_jobs INTEGER NOT NULL DEFAULT 0 CHECK (completed_jobs >= 0),
  is_available BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gig_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 120),
  category TEXT NOT NULL CHECK (category IN ('walking', 'sitting', 'grooming', 'transport', 'training', 'feeding', 'other')),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 20 AND 2500),
  locality TEXT NOT NULL,
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  budget_amount NUMERIC(10,2) NOT NULL CHECK (budget_amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed')),
  safety_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gig_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.gig_jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.gig_worker_profiles(id) ON DELETE CASCADE,
  message TEXT CHECK (char_length(message) <= 1000),
  proposed_amount NUMERIC(10,2) CHECK (proposed_amount > 0),
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, worker_id)
);

CREATE TABLE IF NOT EXISTS public.gig_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL UNIQUE REFERENCES public.gig_jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.gig_worker_profiles(id) ON DELETE RESTRICT,
  agreed_amount NUMERIC(10,2) NOT NULL CHECK (agreed_amount > 0),
  platform_fee NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (platform_fee >= 0),
  worker_payout NUMERIC(10,2) NOT NULL CHECK (worker_payout >= 0),
  status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted', 'checked_in', 'completed', 'cancelled', 'disputed')),
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gig_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.gig_assignments(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('check_in', 'check_out', 'incident_report')),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gig_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL UNIQUE REFERENCES public.gig_assignments(id) ON DELETE RESTRICT,
  worker_id UUID NOT NULL REFERENCES public.gig_worker_profiles(id) ON DELETE RESTRICT,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'eligible', 'paid', 'reversed', 'on_hold')),
  payment_reference TEXT,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gig_jobs_discovery_idx ON public.gig_jobs (status, category, starts_at);
CREATE INDEX IF NOT EXISTS gig_applications_worker_idx ON public.gig_applications (worker_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS gig_assignments_worker_idx ON public.gig_assignments (worker_id, status);

ALTER TABLE public.gig_worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public sees verified available workers" ON public.gig_worker_profiles
  FOR SELECT USING ((identity_status = 'verified' AND is_available) OR user_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY "Workers create their own profile" ON public.gig_worker_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid() AND identity_status = 'pending');
CREATE POLICY "Workers update their own profile" ON public.gig_worker_profiles
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage worker verification" ON public.gig_worker_profiles
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Open jobs are discoverable" ON public.gig_jobs
  FOR SELECT USING (status = 'open' OR owner_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY "Owners create jobs" ON public.gig_jobs
  FOR INSERT WITH CHECK (owner_id = auth.uid() AND status IN ('draft', 'open'));
CREATE POLICY "Owners update their own unassigned jobs" ON public.gig_jobs
  FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Admins manage jobs" ON public.gig_jobs
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Workers view their own applications" ON public.gig_applications
  FOR SELECT USING (worker_id IN (SELECT id FROM public.gig_worker_profiles WHERE user_id = auth.uid()) OR public.is_platform_admin());
CREATE POLICY "Owners view applications to their jobs" ON public.gig_applications
  FOR SELECT USING (job_id IN (SELECT id FROM public.gig_jobs WHERE owner_id = auth.uid()) OR public.is_platform_admin());
CREATE POLICY "Verified workers apply to open jobs" ON public.gig_applications
  FOR INSERT WITH CHECK (worker_id IN (SELECT id FROM public.gig_worker_profiles WHERE user_id = auth.uid() AND identity_status = 'verified') AND job_id IN (SELECT id FROM public.gig_jobs WHERE status = 'open'));

CREATE POLICY "Participants see their assignment" ON public.gig_assignments
  FOR SELECT USING (worker_id IN (SELECT id FROM public.gig_worker_profiles WHERE user_id = auth.uid()) OR job_id IN (SELECT id FROM public.gig_jobs WHERE owner_id = auth.uid()) OR public.is_platform_admin());
CREATE POLICY "Admins manage assignments" ON public.gig_assignments
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
CREATE POLICY "Participants see assignment check-ins" ON public.gig_checkins
  FOR SELECT USING (assignment_id IN (SELECT id FROM public.gig_assignments WHERE worker_id IN (SELECT id FROM public.gig_worker_profiles WHERE user_id = auth.uid()) OR job_id IN (SELECT id FROM public.gig_jobs WHERE owner_id = auth.uid())) OR public.is_platform_admin());
CREATE POLICY "Workers create their own check-ins" ON public.gig_checkins
  FOR INSERT WITH CHECK (actor_id = auth.uid());
CREATE POLICY "Workers see their payouts" ON public.gig_payouts
  FOR SELECT USING (worker_id IN (SELECT id FROM public.gig_worker_profiles WHERE user_id = auth.uid()) OR public.is_platform_admin());
CREATE POLICY "Admins manage gig payouts" ON public.gig_payouts
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
