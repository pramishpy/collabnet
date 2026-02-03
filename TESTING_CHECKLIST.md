# CollabNet Testing Checklist

## Authentication Flow
- [ ] Sign up with @usm.edu email
- [ ] Receive verification email
- [ ] Click verification link
- [ ] Redirect to profile creation
- [ ] Sign out and sign in again
- [ ] Error handling for invalid emails

## Profile Management
- [ ] Create profile with all fields
- [ ] Upload avatar
- [ ] GitHub username verification works
- [ ] Skills tags can be added/removed
- [ ] View own profile
- [ ] Profile displays correctly

## Project Creation
- [ ] Create project with valid data
- [ ] Form validation works (min/max characters)
- [ ] Required skills tags work
- [ ] Project appears in listings
- [ ] Can view created project
- [ ] Character counter works

## Project Discovery
- [ ] Browse all projects
- [ ] Search by keywords works
- [ ] Filter by skills works
- [ ] Filter by status works
- [ ] Combined search + filter works
- [ ] Clear filters works
- [ ] Projects display correctly

## Applications
- [ ] Apply to project with message
- [ ] Can't apply twice to same project
- [ ] Application shows "Applied" status
- [ ] Creator sees applications list
- [ ] Accept/Reject buttons work
- [ ] Status updates correctly
- [ ] Applicant sees updated status

## My Projects Page
- [ ] Created projects tab shows own projects
- [ ] Applied projects tab shows applications
- [ ] Application status badges visible
- [ ] Can navigate to project details

## UI/UX
- [ ] Loading skeletons appear
- [ ] Toast notifications work
- [ ] Error pages display
- [ ] Mobile responsive
- [ ] Dark mode works (if implemented)
- [ ] Navigation header works

## Edge Cases
- [ ] Profile creation required before posting
- [ ] Can't apply to own projects
- [ ] Empty states show helpful messages
- [ ] Invalid project ID shows 404
- [ ] Auth redirect works properly
