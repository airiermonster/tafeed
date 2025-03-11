import { createClient } from '@supabase/supabase-js';

const adminEmail = 'system.admin@tanzaniafeedback.org';
const adminPassword = 'TanzaniaAdmin2024!';

async function createAdminUser() {
  try {
    const supabase = createClient(
      'https://kfuurjvwtnfkxrcxmhhw.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdXVyanZ3dG5ma3hyY3htaGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NTc4MTgsImV4cCI6MjA1NzEzMzgxOH0.GMzzZx50Blnk5nphB3NcUFpT_ko3uMuLJDx4Qk0cvR4'
    );

    // Create user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create admin user');

    const adminId = authData.user.id;
    console.log('User created with ID:', adminId);

    // Assign admin role directly
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: adminId,
        role: 'admin'
      });

    if (roleError) throw roleError;
    console.log('Admin role assigned successfully');

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: 'System Administrator' })
      .eq('id', adminId);

    if (profileError) throw profileError;
    console.log('Profile updated successfully');

    console.log('Admin user created successfully!');
    console.log('Username:', adminEmail);
    console.log('Password:', adminPassword);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser(); 