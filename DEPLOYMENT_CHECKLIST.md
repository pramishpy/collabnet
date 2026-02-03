# CollabNet Deployment Checklist

## Pre-Deployment Tests

### Authentication ✓
- [ ] Sign up with @usm.edu email
- [ ] Email verification works
- [ ] Login/logout works
- [ ] Protected routes redirect properly
- [ ] Session persistence works

### Profile Management ✓
- [ ] Create profile flow complete
- [ ] Avatar upload works
- [ ] GitHub verification works
- [ ] Profile edit functionality
- [ ] Embeddings generated on profile creation

### Projects ✓
- [ ] Create project with embeddings
- [ ] Browse projects with smart sorting
- [ ] Search and filter works
- [ ] Project detail page loads
- [ ] Match explanations display correctly

### Applications ✓
- [ ] Apply to projects
- [ ] View application status
- [ ] Creator can accept/reject
- [ ] Notifications work
- [ ] Can't apply twice

### AI Features ✓
- [ ] Recommendations show on dashboard
- [ ] Match scores calculate correctly
- [ ] Semantic search returns relevant results
- [ ] Match explanations are accurate

### Analytics ✓
- [ ] Analytics page displays data
- [ ] Charts render correctly
- [ ] Performance tips show up

### Performance ✓
- [ ] Page load times < 3s
- [ ] Images optimized
- [ ] Database queries indexed
- [ ] No console errors

## Environment Variables

### Production Environment
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
OPENAI_API_KEY=your_openai_key

