import { createClient } from '@supabase/supabase-js';

// Admin credentials
const adminEmail = 'admin@tanzaniafeedback.org';
const adminPassword = 'TanzaniaAdmin2024!';

async function testLogin() {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      'https://kfuurjvwtnfkxrcxmhhw.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdXVyanZ3dG5ma3hyY3htaGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NTc4MTgsImV4cCI6MjA1NzEzMzgxOH0.GMzzZx50Blnk5nphB3NcUFpT_ko3uMuLJDx4Qk0cvR4'
    );

    console.log('Logging in with admin credentials...');
    
    // Login with admin credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (error) {
      console.error('Login error:', error);
      return;
    }
    
    console.log('Login successful!');
    console.log('User:', data.user);
    
    if (data.user) {
      // Try both RPC functions
      try {
        console.log('\nTesting get_user_role_fixed...');
        const { data: fixedRoleData, error: fixedRoleError } = await supabase.rpc('get_user_role_fixed', {
          p_user_id: data.user.id
        });
        
        if (fixedRoleError) {
          console.error('Error from get_user_role_fixed:', fixedRoleError);
        } else {
          console.log('Role from get_user_role_fixed:', fixedRoleData);
        }
      } catch (e) {
        console.error('Exception calling get_user_role_fixed:', e);
      }
      
      try {
        console.log('\nTesting get_user_role...');
        const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
          user_id: data.user.id
        });
        
        if (roleError) {
          console.error('Error from get_user_role:', roleError);
        } else {
          console.log('Role from get_user_role:', roleData);
        }
      } catch (e) {
        console.error('Exception calling get_user_role:', e);
      }
      
      // Query the user_roles table directly
      try {
        console.log('\nQuerying user_roles table directly...');
        const { data: directRoleData, error: directRoleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        if (directRoleError) {
          console.error('Error querying user_roles:', directRoleError);
        } else {
          console.log('Role from direct query:', directRoleData);
        }
      } catch (e) {
        console.error('Exception querying user_roles:', e);
      }
    }
  } catch (error) {
    console.error('Error in test login:', error);
  }
}

testLogin(); 