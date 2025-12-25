import { createClient } from '@supabase/supabase-js'

// သင့်ရဲ့ Supabase API Keys များဖြစ်သည်
const supabaseUrl = 'https://pvgoqadvovnaeykoidmh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2Z29xYWR2b3ZuYWV5a29pZG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NjcyMTEsImV4cCI6MjA4MjI0MzIxMX0.zhsIv5bgjNAJxnm0feqiS1ssqKAeWGnuGRlGAhf6c3o'

export const supabase = createClient(supabaseUrl, supabaseKey)
