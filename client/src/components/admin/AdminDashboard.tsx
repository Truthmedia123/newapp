import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, FileText, BarChart2, Eye, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import MobileAnalyticsDashboard from '@/components/MobileAnalyticsDashboard';

// MDX editor component (simplified for now)
const MDXEditor = ({ markdown, onChange }: { markdown: string; onChange: (content: string) => void }) => (
  <textarea
    value={markdown}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-64 p-2 border rounded"
    placeholder="Enter markdown content here..."
  />
);

// Type definitions
interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  contactEmail: string;
  isVerified: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  published: boolean;
}

interface RsvpTemplate {
  id: string;
  name: string;
  type: 'Hindu' | 'Christian' | 'Islamic';
  config: any;
}

const ADMIN_TOKENS: Record<string, string> = {
  'admin-2025-goa': 'full-access',
  'vendor-manager': 'vendor-only',
  'content-editor': 'blog-only'
};

// Implement role-based access
const checkPermissions = (token: string, action: string): boolean => {
  console.log('Checking permissions for token:', token, 'action:', action);
  const permissions = ADMIN_TOKENS[token];
  console.log('Permissions found:', permissions);
  
  if (!permissions) return false;
  
  const hasPermission = (
    permissions === 'full-access' ||
    (permissions === 'vendor-only' && action === 'vendors') ||
    (permissions === 'blog-only' && action === 'blog') ||
    (permissions === 'full-access' && (action === 'templates' || action === 'analytics'))
  );
  
  console.log('Has permission:', hasPermission);
  return hasPermission;
};

// Add error boundary to prevent blank pages
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: React.PropsWithChildren<{children: React.ReactNode}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AdminDashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">There was an error loading the admin dashboard.</p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  sessionStorage.removeItem('adminToken');
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState('');
  const [userRole, setUserRole] = useState<'full-access' | 'vendor-only' | 'blog-only' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('vendors');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  // Debug logging
  console.log('AdminDashboard rendering with:', { adminToken, isAuthenticated, userRole });
  
  // Enhanced authentication with better error handling
  useEffect(() => {
    console.log('AdminDashboard useEffect running');
    
    // Function to handle authentication
    const handleAuthentication = async () => {
      try {
        let token = sessionStorage.getItem('adminToken');
        console.log('Token from sessionStorage:', token);
        
        // If no token in sessionStorage or invalid token
        if (!token || !ADMIN_TOKENS[token]) {
          console.log('No valid token found in sessionStorage');
          
          // Try to get token from URL parameter first
          const urlParams = new URLSearchParams(window.location.search);
          const urlToken = urlParams.get('token');
          
          if (urlToken && ADMIN_TOKENS[urlToken]) {
            console.log('Valid token found in URL parameter');
            token = urlToken;
          } else {
            console.log('No valid token in URL, prompting user');
            // Use a more reliable way to get token
            const tokenInput = window.prompt('Enter admin token:');
            token = tokenInput || '';
          }
          
          console.log('Token to validate:', token);
          
          if (token && ADMIN_TOKENS[token]) {
            console.log('Valid token entered, setting session storage and state');
            sessionStorage.setItem('adminToken', token);
            setAdminToken(token);
            setIsAuthenticated(true);
            // Set user role based on token
            setUserRole(ADMIN_TOKENS[token] as 'full-access' | 'vendor-only' | 'blog-only');
          } else if (token) {
            console.log('Invalid token entered');
            alert('Invalid admin token');
          }
        } else {
          console.log('Valid token found in session storage');
          setAdminToken(token);
          setIsAuthenticated(true);
          // Set user role based on token
          setUserRole(ADMIN_TOKENS[token] as 'full-access' | 'vendor-only' | 'blog-only');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Even if there's an error, we should still render something
        setIsAuthenticated(false);
      }
    };
    
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(handleAuthentication, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Headers for API requests
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-token': adminToken,
  };

  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // Enhanced data fetching with better error handling
  const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/vendors', { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching vendors:', error);
        // Return mock data as fallback
        return mockVendors;
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0,
  });

  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/blog', { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Return mock data as fallback
        return mockPosts;
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0,
  });

  const { data: templates, isLoading: templatesLoading, error: templatesError } = useQuery<RsvpTemplate[]>({
    queryKey: ['templates'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/rsvptemplates', { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching templates:', error);
        // Return mock data as fallback
        return mockTemplates;
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0,
  });

  // Mutations
  const createVendorMutation = useMutation({
    mutationFn: (newVendor: Omit<Vendor, 'id'>) => 
      fetch('/api/vendors', {
        method: 'POST',
        headers,
        body: JSON.stringify(newVendor),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor created successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create vendor',
      });
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: (updatedVendor: Vendor) => 
      fetch(`/api/vendors/${updatedVendor.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedVendor),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor updated successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update vendor',
      });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/vendors/${id}`, {
        method: 'DELETE',
        headers,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor deleted successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete vendor',
      });
    },
  });

  // Blog mutations
  const createPostMutation = useMutation({
    mutationFn: (newPost: Omit<BlogPost, 'id'>) => 
      fetch('/api/blog', {
        method: 'POST',
        headers,
        body: JSON.stringify(newPost),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create blog post',
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (updatedPost: BlogPost) => 
      fetch(`/api/blog/${updatedPost.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedPost),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update blog post',
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete blog post',
      });
    },
  });

  // Template mutations
  const createTemplateMutation = useMutation({
    mutationFn: (newTemplate: Omit<RsvpTemplate, 'id'>) => 
      fetch('/api/rsvptemplates', {
        method: 'POST',
        headers,
        body: JSON.stringify(newTemplate),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: 'Success',
        description: 'RSVP template created successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create RSVP template',
      });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: (updatedTemplate: RsvpTemplate) => 
      fetch(`/api/rsvptemplates/${updatedTemplate.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedTemplate),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: 'Success',
        description: 'RSVP template updated successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update RSVP template',
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/rsvptemplates/${id}`, {
        method: 'DELETE',
        headers,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: 'Success',
        description: 'RSVP template deleted successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete RSVP template',
      });
    },
  });

  // Export analytics
  const exportAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/export?start=${dateRange.from?.toISOString()}&end=${dateRange.to?.toISOString()}`, {
        headers,
      });
      
      if (!response.ok) throw new Error('Failed to export analytics');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Analytics exported successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to export analytics',
      });
    }
  };

  // Enhanced error handling
  useEffect(() => {
    if (vendorsError) {
      console.error('Vendors error:', vendorsError);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: vendorsError instanceof Error ? vendorsError.message : 'Failed to fetch vendors',
      });
    }
    
    if (postsError) {
      console.error('Posts error:', postsError);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: postsError instanceof Error ? postsError.message : 'Failed to fetch posts',
      });
    }
    
    if (templatesError) {
      console.error('Templates error:', templatesError);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: templatesError instanceof Error ? templatesError.message : 'Failed to fetch templates',
      });
    }
  }, [vendorsError, postsError, templatesError]);

  // Mock data for initial state if API is unavailable
  const mockVendors: Vendor[] = [
    {
      id: '1',
      name: 'Goa Wedding Photography',
      category: 'Photography',
      location: 'North Goa',
      priceRange: [30000, 50000],
      rating: 4.8,
      contactEmail: 'info@goaweddingphoto.com',
      isVerified: true,
    },
    {
      id: '2',
      name: 'Beachside Venues',
      category: 'Venues',
      location: 'South Goa',
      priceRange: [100000, 200000],
      rating: 4.6,
      contactEmail: 'bookings@beachsidevenues.com',
      isVerified: true,
    },
    {
      id: '3',
      name: 'Goan Flavors Catering',
      category: 'Catering',
      location: 'Panjim',
      priceRange: [800, 1500],
      rating: 4.9,
      contactEmail: 'catering@goanflavors.com',
      isVerified: false,
    },
    {
      id: '4',
      name: 'Royal Makeup Artists',
      category: 'Makeup',
      location: 'Calangute',
      priceRange: [15000, 25000],
      rating: 4.7,
      contactEmail: 'royal@makeupartists.com',
      isVerified: true,
    },
    {
      id: '5',
      name: 'Floral Dreams Decor',
      category: 'Decoration',
      location: 'Margao',
      priceRange: [20000, 40000],
      rating: 4.5,
      contactEmail: 'floral@dreamsdecor.com',
      isVerified: false,
    },
  ];

  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Top 10 Wedding Venues in Goa',
      slug: 'top-10-wedding-venues-goa',
      date: '2024-01-15',
      category: 'Venues',
      published: true,
    },
    {
      id: '2',
      title: 'Traditional Goan Wedding Customs',
      slug: 'traditional-goa-wedding-customs',
      date: '2024-01-20',
      category: 'Traditions',
      published: true,
    },
    {
      id: '3',
      title: 'Planning Your Destination Wedding',
      slug: 'planning-destination-wedding',
      date: '2024-01-25',
      category: 'Planning',
      published: false,
    },
  ];

  const mockTemplates: RsvpTemplate[] = [
    {
      id: '1',
      name: 'Hindu Wedding RSVP',
      type: 'Hindu',
      config: {
        fields: ['name', 'email', 'attendance', 'dietary'],
        customMessage: 'We cordially invite you to celebrate our special day',
      },
    },
    {
      id: '2',
      name: 'Christian Wedding RSVP',
      type: 'Christian',
      config: {
        fields: ['name', 'email', 'attendance', 'plusOne'],
        customMessage: 'You are cordially invited to witness our union',
      },
    },
    {
      id: '3',
      name: 'Islamic Wedding RSVP',
      type: 'Islamic',
      config: {
        fields: ['name', 'email', 'attendance'],
        customMessage: 'We invite you to share in our joy',
      },
    },
  ];

  // Vendor management state
  const [vendorForm, setVendorForm] = useState<Omit<Vendor, 'id'> & { id?: string }>({
    name: '',
    category: '',
    location: '',
    priceRange: [0, 0],
    rating: 0,
    contactEmail: '',
    isVerified: false,
  });
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  // Blog management state
  const [postForm, setPostForm] = useState<Omit<BlogPost, 'id'> & { id?: string }>({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    published: false,
  });
  const [postContent, setPostContent] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Template management state
  const [templateForm, setTemplateForm] = useState<Omit<RsvpTemplate, 'id'> & { id?: string }>({
    name: '',
    type: 'Hindu',
    config: {},
  });
  const [templateConfig, setTemplateConfig] = useState('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Handle vendor form changes
  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setVendorForm(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'minPrice' || name === 'maxPrice') {
      const priceIndex = name === 'minPrice' ? 0 : 1;
      const newPriceRange = [...vendorForm.priceRange] as [number, number];
      newPriceRange[priceIndex] = Number(value);
      setVendorForm(prev => ({ ...prev, priceRange: newPriceRange }));
    } else {
      setVendorForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle post form changes
  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPostForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setPostForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle template form changes
  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTemplateForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle vendor form submit
  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorForm.id) {
      updateVendorMutation.mutate({ ...vendorForm, id: vendorForm.id } as Vendor);
    } else {
      createVendorMutation.mutate(vendorForm);
    }
    setIsVendorModalOpen(false);
    setVendorForm({
      name: '',
      category: '',
      location: '',
      priceRange: [0, 0],
      rating: 0,
      contactEmail: '',
      isVerified: false,
    });
  };

  // Handle post form submit
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postForm.id) {
      updatePostMutation.mutate({ ...postForm, id: postForm.id } as BlogPost);
    } else {
      createPostMutation.mutate(postForm);
    }
    setIsPostModalOpen(false);
    setPostForm({
      title: '',
      slug: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      published: false,
    });
    setPostContent('');
  };

  // Handle template form submit
  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = JSON.parse(templateConfig);
      if (templateForm.id) {
        updateTemplateMutation.mutate({ ...templateForm, id: templateForm.id, config } as RsvpTemplate);
      } else {
        createTemplateMutation.mutate({ ...templateForm, config });
      }
      setIsTemplateModalOpen(false);
      setTemplateForm({
        name: '',
        type: 'Hindu',
        config: {},
      });
      setTemplateConfig('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid JSON in config field',
      });
    }
  };

  // Open vendor modal for editing
  const openVendorEdit = (vendor: Vendor) => {
    setVendorForm(vendor);
    setIsVendorModalOpen(true);
  };

  // Open post modal for editing
  const openPostEdit = (post: BlogPost) => {
    setPostForm(post);
    setIsPostModalOpen(true);
  };

  // Open template modal for editing
  const openTemplateEdit = (template: RsvpTemplate) => {
    setTemplateForm(template);
    setTemplateConfig(JSON.stringify(template.config, null, 2));
    setIsTemplateModalOpen(true);
  };

  // Confirm vendor deletion
  const confirmVendorDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete vendor "${name}"?`)) {
      deleteVendorMutation.mutate(id);
    }
  };

  // Confirm post deletion
  const confirmPostDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete post "${title}"?`)) {
      deletePostMutation.mutate(id);
    }
  };

  // Confirm template deletion
  const confirmTemplateDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete template "${name}"?`)) {
      deleteTemplateMutation.mutate(id);
    }
  };

  // Enhanced rendering with error boundary
  return (
    <ErrorBoundary>
      {!isAuthenticated ? (
        <div className="flex items-center justify-center h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please enter admin token to access dashboard.</p>
              <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-800">
                  Debug Info: Token: {adminToken || 'none'}, Authenticated: {isAuthenticated ? 'true' : 'false'}
                </p>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={() => {
                    sessionStorage.removeItem('adminToken');
                    window.location.reload();
                  }}
                >
                  Retry Authentication
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage vendors, blog posts, and RSVP templates</p>
              <div className="mt-2 text-sm text-gray-500">
                Token: {adminToken} | Role: {userRole}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                {checkPermissions(adminToken, 'vendors') && (
                  <TabsTrigger value="vendors">Vendors</TabsTrigger>
                )}
                {checkPermissions(adminToken, 'blog') && (
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                )}
                {ADMIN_TOKENS[adminToken] === 'full-access' && (
                  <TabsTrigger value="templates">RSVP Templates</TabsTrigger>
                )}
                {ADMIN_TOKENS[adminToken] === 'full-access' && (
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                )}
              </TabsList>

              {/* Vendor Management Tab */}
              <TabsContent value="vendors" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Vendor Management</CardTitle>
                    {checkPermissions(adminToken, 'vendors') && (
                      <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setVendorForm({
                            name: '',
                            category: '',
                            location: '',
                            priceRange: [0, 0],
                            rating: 0,
                            contactEmail: '',
                            isVerified: false,
                          })}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Vendor
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{vendorForm.id ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleVendorSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                  name="name"
                                  value={vendorForm.name}
                                  onChange={handleVendorChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                  name="category"
                                  value={vendorForm.category}
                                  onChange={handleVendorChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Location</label>
                                <Input
                                  name="location"
                                  value={vendorForm.location}
                                  onChange={handleVendorChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Contact Email</label>
                                <Input
                                  name="contactEmail"
                                  type="email"
                                  value={vendorForm.contactEmail}
                                  onChange={handleVendorChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Min Price</label>
                                <Input
                                  name="minPrice"
                                  type="number"
                                  value={vendorForm.priceRange[0]}
                                  onChange={handleVendorChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Max Price</label>
                                <Input
                                  name="maxPrice"
                                  type="number"
                                  value={vendorForm.priceRange[1]}
                                  onChange={handleVendorChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Rating</label>
                                <Input
                                  name="rating"
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="5"
                                  value={vendorForm.rating}
                                  onChange={handleVendorChange}
                                  required
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="isVerified"
                                  name="isVerified"
                                  checked={vendorForm.isVerified}
                                  onChange={handleVendorChange}
                                  className="h-4 w-4"
                                />
                                <label htmlFor="isVerified" className="text-sm font-medium">Verified</label>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Image</label>
                              <Input type="file" accept="image/*" />
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsVendorModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                {vendorForm.id ? 'Update Vendor' : 'Add Vendor'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardHeader>
                  <CardContent>
                    {vendorsLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Price Range</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Verified</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(vendors || mockVendors).map((vendor: Vendor) => (
                            <TableRow key={vendor.id}>
                              <TableCell className="font-medium">{vendor.name}</TableCell>
                              <TableCell>{vendor.category}</TableCell>
                              <TableCell>{vendor.location}</TableCell>
                              <TableCell>₹{vendor.priceRange[0]} - ₹{vendor.priceRange[1]}</TableCell>
                              <TableCell>{vendor.rating}</TableCell>
                              <TableCell>
                                {vendor.isVerified ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  {checkPermissions(adminToken, 'vendors') ? (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openVendorEdit(vendor)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => confirmVendorDelete(vendor.id, vendor.name)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">No access</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blog Management Tab */}
              <TabsContent value="blog" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Blog Management</CardTitle>
                    {checkPermissions(adminToken, 'blog') && (
                      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setPostForm({
                            title: '',
                            slug: '',
                            date: new Date().toISOString().split('T')[0],
                            category: '',
                            published: false,
                          })}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Post
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{postForm.id ? 'Edit Post' : 'New Post'}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handlePostSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                  name="title"
                                  value={postForm.title}
                                  onChange={handlePostChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Slug</label>
                                <Input
                                  name="slug"
                                  value={postForm.slug}
                                  onChange={handlePostChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Date</label>
                                <Input
                                  name="date"
                                  type="date"
                                  value={postForm.date}
                                  onChange={handlePostChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                  name="category"
                                  value={postForm.category}
                                  onChange={handlePostChange}
                                  required
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="published"
                                  name="published"
                                  checked={postForm.published}
                                  onChange={handlePostChange}
                                  className="h-4 w-4"
                                />
                                <label htmlFor="published" className="text-sm font-medium">Published</label>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Content</label>
                              {typeof window !== 'undefined' && (
                                <MDXEditor
                                  markdown={postContent}
                                  onChange={setPostContent}
                                />
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button type="button" variant="outline" onClick={() => setIsPreviewOpen(true)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsPostModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                {postForm.id ? 'Update Post' : 'Create Post'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardHeader>
                  <CardContent>
                    {postsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(posts || mockPosts).map((post: BlogPost) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>{post.category}</TableCell>
                              <TableCell>{post.date}</TableCell>
                              <TableCell>
                                {post.published ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Published
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Draft
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  {checkPermissions(adminToken, 'blog') ? (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openPostEdit(post)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => confirmPostDelete(post.id, post.title)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">No access</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* RSVP Templates Tab */}
              <TabsContent value="templates" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>RSVP Templates</CardTitle>
                    {ADMIN_TOKENS[adminToken] === 'full-access' && (
                      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setTemplateForm({
                            name: '',
                            type: 'Hindu',
                            config: {},
                          })}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Template
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{templateForm.id ? 'Edit Template' : 'New Template'}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleTemplateSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                  name="name"
                                  value={templateForm.name}
                                  onChange={handleTemplateChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Type</label>
                                <select
                                  name="type"
                                  value={templateForm.type}
                                  onChange={handleTemplateChange}
                                  className="w-full p-2 border rounded"
                                  required
                                >
                                  <option value="Hindu">Hindu</option>
                                  <option value="Christian">Christian</option>
                                  <option value="Islamic">Islamic</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Configuration (JSON)</label>
                              <textarea
                                value={templateConfig}
                                onChange={(e) => setTemplateConfig(e.target.value)}
                                className="w-full h-32 p-2 border rounded font-mono text-sm"
                                placeholder='{"fields": ["name", "email", "attendance"], "customMessage": "You are invited..."}'
                                required
                              />
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                {templateForm.id ? 'Update Template' : 'Create Template'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardHeader>
                  <CardContent>
                    {templatesLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(templates || mockTemplates).map((template: RsvpTemplate) => (
                            <TableRow key={template.id}>
                              <TableCell className="font-medium">{template.name}</TableCell>
                              <TableCell>{template.type}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  {ADMIN_TOKENS[adminToken] === 'full-access' ? (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openTemplateEdit(template)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => confirmTemplateDelete(template.id, template.name)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">No access</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(dateRange.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange.from}
                              selected={{ from: dateRange.from, to: dateRange.to } as any}
                              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        <Button onClick={exportAnalytics} variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Export CSV
                        </Button>
                      </div>
                    </div>
                    <MobileAnalyticsDashboard />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}