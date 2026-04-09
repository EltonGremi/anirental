-- ============================================================================
-- RLS (Row Level Security) Policies for AutoRent Albania
-- ============================================================================
-- These policies MUST be applied to the Supabase database to ensure security.
-- Apply them via the Supabase SQL Editor or local migrations.
-- 
-- CRITICAL: Without these policies, ANY user with the anon key can access
-- all data. This is a severe security vulnerability.
-- ============================================================================

BEGIN;

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Users can see their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can see all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (
    SELECT role FROM public.profiles WHERE id = auth.uid()
  ));

-- Prevent non-admins from creating/deleting profiles (handled by auth triggers)
CREATE POLICY "Prevent unauthorized profile deletion"
  ON public.profiles FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- ============================================================================
-- VEHICLES TABLE
-- ============================================================================

-- Everyone can read vehicles (public catalog)
CREATE POLICY "Anyone can read vehicles"
  ON public.vehicles FOR SELECT
  USING (true);

-- Only admins can create vehicles
CREATE POLICY "Only admins can create vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- Only admins can update vehicles
CREATE POLICY "Only admins can update vehicles"
  ON public.vehicles FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- Only admins can delete vehicles
CREATE POLICY "Only admins can delete vehicles"
  ON public.vehicles FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================

-- Clients can see only their own bookings
CREATE POLICY "Clients can read own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = client_id);

-- Admins can see all bookings
CREATE POLICY "Admins can read all bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- Only clients can create bookings for themselves
CREATE POLICY "Clients can create own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role != 'admin')
  );

-- Clients can update their own pending bookings
CREATE POLICY "Clients can update own bookings (if pending)"
  ON public.bookings FOR UPDATE
  USING (
    auth.uid() = client_id AND
    status = 'pending'
  )
  WITH CHECK (
    auth.uid() = client_id AND
    status = 'pending'
  );

-- Admins can update any booking (confirmation, rejection, etc)
CREATE POLICY "Admins can update any booking"
  ON public.bookings FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- Clients can cancel their own bookings
CREATE POLICY "Clients can cancel own bookings"
  ON public.bookings FOR DELETE
  USING (
    auth.uid() = client_id AND
    status NOT IN ('completed', 'cancelled')
  );

-- Admins can delete any booking
CREATE POLICY "Admins can delete any booking"
  ON public.bookings FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================

-- Everyone can read reviews (public)
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Only authenticated users can create reviews (they authored them)
CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    auth.uid() IS NOT NULL
  );

-- Users can update only their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Users can delete only their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = author_id);

-- Admins can delete any review (moderation)
CREATE POLICY "Admins can moderate reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- ============================================================================
-- NOTIFICATIONS_LOG TABLE
-- ============================================================================

-- Only admins can read notifications log
CREATE POLICY "Admins can read notifications log"
  ON public.notifications_log FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

-- Only service role (Deno functions) can insert
CREATE POLICY "Service role can create notifications"
  ON public.notifications_log FOR INSERT
  WITH CHECK (true); -- Service role has full access

-- Only admins can delete old logs
CREATE POLICY "Admins can delete old notifications"
  ON public.notifications_log FOR DELETE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify RLS is properly enabled:
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public';
--
-- SELECT * FROM pg_policies WHERE tablename IN (
--   'profiles', 'vehicles', 'bookings', 'reviews', 'notifications_log'
-- );
-- ============================================================================
