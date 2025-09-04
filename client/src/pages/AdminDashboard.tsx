import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Database, Upload, Settings, Eye, EyeOff } from 'lucide-react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Check authentication on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token === 'admin-secret-2024') { // Change this to your secret token
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (adminToken === 'admin-secret-2024') { // Change this to your secret token
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin token');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
            <p className="text-center text-gray-600">Enter admin token to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="token">Admin Token</Label>
              <div className="relative">
                <Input
                  id="token"
                  type={showToken ? "text" : "password"}
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="Enter admin token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full">
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your wedding platform</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Featured Vendors</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <Badge variant="secondary" className="text-yellow-600">Featured</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Database Status</p>
                      <p className="text-2xl font-bold text-green-600">Active</p>
                    </div>
                    <Database className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Upload className="h-6 w-6 mb-2" />
                    Import Vendors from CSV
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Database className="h-6 w-6 mb-2" />
                    Run Database Seed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <p className="text-gray-600">Manage vendors through Netlify CMS</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">CMS Access</h3>
                    <p className="text-blue-700 mb-4">
                      All vendor management is done through Netlify CMS for better control and versioning.
                    </p>
                    <Button asChild>
                      <a href="/admin" target="_blank" rel="noopener noreferrer">
                        Open Netlify CMS
                      </a>
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Workflow</h3>
                    <ul className="text-green-700 space-y-1">
                      <li>• Add vendors through CMS interface</li>
                      <li>• Use draft mode for review before publishing</li>
                      <li>• All changes are version controlled in Git</li>
                      <li>• Automatic deployment on publish</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Import</CardTitle>
                <p className="text-gray-600">Import vendors from CSV files</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">CSV Format</h3>
                  <p className="text-yellow-700 mb-2">
                    Expected CSV format with headers:
                  </p>
                  <code className="text-sm bg-gray-100 p-2 rounded block">
                    name,category,description,phone,email,whatsapp,location,address,website,instagram,facebook,services,price_range,featured,verified
                  </code>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="csv-content">CSV Content</Label>
                    <Textarea
                      id="csv-content"
                      placeholder="Paste your CSV content here..."
                      rows={10}
                    />
                  </div>
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Vendors
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Command Line Import</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    For large imports, use the command line script:
                  </p>
                  <code className="text-sm bg-gray-100 p-2 rounded block">
                    node scripts/import-vendors.js path/to/vendors.csv
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Database Status</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Connected to Cloudflare D1</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>CMS Status</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Netlify CMS Active</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Deployment Status</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Cloudflare Pages Active</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Admin Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Database className="h-4 w-4 mr-2" />
                      Run Database Migrations
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
