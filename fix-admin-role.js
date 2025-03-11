import { createClient } from '@supabase/supabase-js';

// Admin credentials
const adminEmail = 'admin@tanzaniafeedback.org';
const adminPassword = 'TanzaniaAdmin2024!';
const adminUserId = '2437a896-0667-4095-b531-11d50bd619e7';

async function fixAdminRole() {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      'https://kfuurjvwtnfkxrcxmhhw.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdXVyanZ3dG5ma3hyY3htaGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NTc4MTgsImV4cCI6MjA1NzEzMzgxOH0.GMzzZx50Blnk5nphB3NcUFpT_ko3uMuLJDx4Qk0cvR4'
    );

    // First check the current role using the fixed function
    const { data: currentRole, error: roleError } = await supabase.rpc('get_user_role_fixed', {
      p_user_id: adminUserId
    });

    if (roleError) {
      console.error('Error checking role:', roleError);
    } else {
      console.log('Current role:', currentRole);
    }

    // Ensure admin role is set using the fixed function
    const { error: assignError } = await supabase.rpc('assign_user_role_fixed', {
      p_user_id: adminUserId,
      p_role_name: 'admin'
    });

    if (assignError) {
      console.error('Error assigning role:', assignError);
    } else {
      console.log('Admin role assigned successfully');
    }

    // Check the role again to confirm
    const { data: updatedRole, error: checkError } = await supabase.rpc('get_user_role_fixed', {
      p_user_id: adminUserId
    });

    if (checkError) {
      console.error('Error checking updated role:', checkError);
    } else {
      console.log('Updated role:', updatedRole);
    }

    console.log('Admin user role has been fixed');
    console.log('Username:', adminEmail);
    console.log('Password:', adminPassword);
  } catch (error) {
    console.error('Error fixing admin role:', error);
  }
}

fixAdminRole(); 