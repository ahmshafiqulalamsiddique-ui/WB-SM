"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  // Prevent browser auto-fill and reset form on mount
  useEffect(() => {
    console.log('🔑 Component mounted, implementing aggressive anti-autofill...');
    
    // Force clear any browser auto-filled values
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Aggressive anti-autofill measures
    const disableAutofill = () => {
      const inputs = document.querySelectorAll('input[type="password"]');
      inputs.forEach((input: any) => {
        // Multiple anti-autofill attributes
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('data-form-type', 'other');
        input.setAttribute('data-lpignore', 'true');
        input.setAttribute('data-1p-ignore', 'true');
        input.setAttribute('data-bwignore', 'true');
        input.setAttribute('data-dashlane-ignore', 'true');
        input.setAttribute('data-bitwarden-ignore', 'true');
        input.setAttribute('data-keepass-ignore', 'true');
        input.setAttribute('data-lastpass-ignore', 'true');
        input.setAttribute('data-1password-ignore', 'true');
        
        // Force clear value
        input.value = '';
        
        // Disable password manager detection
        input.setAttribute('readonly', 'true');
        setTimeout(() => {
          input.removeAttribute('readonly');
        }, 100);
      });
    };
    
    // Run immediately and after a delay
    disableAutofill();
    setTimeout(disableAutofill, 100);
    setTimeout(disableAutofill, 500);
    setTimeout(disableAutofill, 1000);
    
    console.log('🔑 Aggressive anti-autofill complete');
  }, []);

  // Monitor form state changes
  useEffect(() => {
    console.log('🔑 Form state updated:', {
      oldPassword: formData.oldPassword ? '[HIDDEN]' : '[EMPTY]',
      newPassword: formData.newPassword ? '[HIDDEN]' : '[EMPTY]',
      confirmPassword: formData.confirmPassword ? '[HIDDEN]' : '[EMPTY]'
    });
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any default browser behavior
    
    setLoading(true);
    setMessage(null);

    // Client-side validation
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      setLoading(false);
      return;
    }

    try {
      console.log('🔑 Submitting password change request...');
      console.log('🔑 Form data being sent:', { 
        oldPassword: formData.oldPassword ? '[HIDDEN]' : '[EMPTY]',
        newPassword: formData.newPassword ? '[HIDDEN]' : '[EMPTY]',
        confirmPassword: formData.confirmPassword ? '[HIDDEN]' : '[EMPTY]'
      });
      
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      console.log('🔑 Response status:', response.status);
      const result = await response.json();
      console.log('🔑 Password change result:', result);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Clear form
        resetForm();
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      console.error('Change password error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔑 Input changed:', e.target.name, e.target.value);
    
    // Map the new field names to the old state structure
    const fieldMap: { [key: string]: string } = {
      'currentPass': 'oldPassword',
      'newPass': 'newPassword',
      'confirmPass': 'confirmPassword'
    };
    
    const stateField = fieldMap[e.target.name] || e.target.name;
    
    setFormData({
      ...formData,
      [stateField]: e.target.value
    });
  };

  const resetForm = () => {
    console.log('🔑 Resetting form...');
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage(null);
    
    // Force clear any browser auto-filled values
    const inputs = document.querySelectorAll('input[type="password"]');
    inputs.forEach((input: any) => {
      input.value = '';
      input.setAttribute('autocomplete', 'off');
    });
  };

  return (
    <>
      {/* Meta tags to prevent password manager detection */}
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow" />
      
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>
      
      {/* Hidden dummy form to prevent browser auto-fill */}
      <form style={{ display: 'none' }}>
        <input type="text" name="username" autoComplete="username" />
        <input type="password" name="password" autoComplete="current-password" />
        <input type="password" name="new_password" autoComplete="new-password" />
      </form>
      
      {/* Additional decoy forms */}
      <form style={{ display: 'none' }}>
        <input type="text" name="login" />
        <input type="password" name="pass" />
      </form>
      
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" data-form-type="other">
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPass"
            name="currentPass"
            value={formData.oldPassword}
            onChange={handleInputChange}
            required
            autoComplete="off"
            data-form-type="other"
            data-lpignore="true"
            data-1p-ignore="true"
            data-bwignore="true"
            data-dashlane-ignore="true"
            data-bitwarden-ignore="true"
            data-keepass-ignore="true"
            data-lastpass-ignore="true"
            data-1password-ignore="true"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPass"
            name="newPass"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
            minLength={6}
            autoComplete="off"
            data-form-type="other"
            data-lpignore="true"
            data-1p-ignore="true"
            data-bwignore="true"
            data-dashlane-ignore="true"
            data-bitwarden-ignore="true"
            data-keepass-ignore="true"
            data-lastpass-ignore="true"
            data-1password-ignore="true"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your new password (min 6 characters)"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPass"
            name="confirmPass"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            minLength={6}
            autoComplete="off"
            data-form-type="other"
            data-lpignore="true"
            data-1p-ignore="true"
            data-bwignore="true"
            data-dashlane-ignore="true"
            data-bitwarden-ignore="true"
            data-keepass-ignore="true"
            data-lastpass-ignore="true"
            data-1password-ignore="true"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm your new password"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Clear Form
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Minimum 6 characters</li>
          <li>• Must be different from current password</li>
          <li>• New password and confirmation must match</li>
        </ul>
      </div>
      </div>
    </>
  );
}
