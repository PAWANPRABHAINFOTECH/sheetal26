# Plan: Security & Privacy Hardening

## Background
The user wants to address security issues mentioned in their "scan results". Although a standard linter check returned no issues, the project uses a custom admin role system that may have common pitfalls, such as overly broad RLS policies or permissive GRANTs.

## Proposed Fixes

1. **RLS Policy Refinement**
   - The current policies use `TO authenticated` and `USING (true)` which allows ANY authenticated Supabase user to perform admin actions.
   - Refactor policies to strictly use the `public.has_role(auth.uid(), 'admin')` check for all write operations.

2. **Grant Scoping**
   - Remove `GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated`.
   - Explicitly grant permissions based on role needs.

3. **Data Privacy**
   - Ensure the `contact_enquiries` table is only accessible by admins.
   - Currently, all authenticated users have full access to enquiries.

4. **Member Information Privacy**
   - The `members` table includes a `mobile_number` field. I will ensure that this field is only returned if `mobile_number_show` is true, or for admins.

## Technical Details
- Update RLS policies across all tables to use `has_role`.
- Revoke generic grants and apply specific ones.
- Add a security-definer function or view if needed to handle filtered member data.
