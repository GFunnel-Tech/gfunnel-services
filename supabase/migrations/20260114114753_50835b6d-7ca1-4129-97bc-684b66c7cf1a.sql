-- Allow service role to insert into user_roles without RLS blocking
-- This is needed for the initial admin setup
CREATE POLICY "Service role can manage all roles"
ON public.user_roles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Also allow public read access to companies/company_users for wallet-proxy edge function (using service role)
CREATE POLICY "Service role can read companies"
ON public.companies FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role can read company_users"
ON public.company_users FOR SELECT
TO service_role
USING (true);

CREATE POLICY "Service role can read access_items"
ON public.access_items FOR SELECT
TO service_role
USING (true);