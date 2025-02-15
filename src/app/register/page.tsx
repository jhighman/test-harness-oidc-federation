"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

const ENDPOINTS = [
  { label: "Local Development", value: "http://localhost:5000/oidc/register" },
  { label: "Staging", value: "https://staging.testharness.com/oidc/register" },
  { label: "Production", value: "https://testharness.com/oidc/register" },
] as const

// Following OpenID Connect Standard Claims
// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
const formSchema = z.object({
  sub: z.string().min(2).max(50),
  name: z.string().optional(),
  given_name: z.string().min(2).max(50),
  family_name: z.string().min(2).max(50),
  middle_name: z.string().optional(),
  nickname: z.string().optional(),
  preferred_username: z.string().optional(),
  profile: z.string().url().optional(),
  picture: z.string().url().optional(),
  website: z.string().url().optional(),
  email: z.string().email(),
  email_verified: z.boolean().default(false),
  gender: z.string().optional(),
  birthdate: z.string().optional(),
  zoneinfo: z.string().optional(),
  locale: z.string().optional(),
  phone_number: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: "Phone number must be in E.164 format (e.g., +15555555555)",
  }),
  phone_number_verified: z.boolean().default(false),
  address: z.object({
    formatted: z.string().optional(),
    street_address: z.string().optional(),
    locality: z.string().optional(),
    region: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  updated_at: z.number().default(() => Math.floor(Date.now() / 1000)),
  // OIDC specific fields
  iss: z.string().url().default("https://testharness.com"),
  aud: z.string().default("trua_headless"),
  iat: z.number().default(() => Math.floor(Date.now() / 1000)),
  exp: z.number().default(() => Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
  endpoint: z.string().default(ENDPOINTS[0].value),
})

export default function RegisterPage() {
  const [submittedData, setSubmittedData] = useState<z.infer<typeof formSchema> | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sub: "",
      given_name: "",
      family_name: "",
      email: "",
      email_verified: false,
      phone_number: "",
      phone_number_verified: false,
      iss: "https://testharness.com",
      aud: "trua_headless",
      endpoint: ENDPOINTS[0].value,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmittedData(values)
    toast({
      title: "Registration Submitted",
      description: "Your registration details have been received.",
    })
  }

  function generateJWT(data: z.infer<typeof formSchema>) {
    const { endpoint, ...payload } = data
    
    // Create JWT parts
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const body = btoa(JSON.stringify(payload))
    const signature = 'DEMO-SIGNATURE' // In real apps, this would be cryptographically signed
    
    return `${header}.${body}.${signature}`
  }

  function generateCurlCommand(data: z.infer<typeof formSchema>) {
    const { endpoint, ...payload } = data
    const token = generateJWT(data)
    return `curl -X POST ${endpoint} \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer ${token}" \\
     -d '${JSON.stringify(payload, null, 2)}'`
  }

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select endpoint" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ENDPOINTS.map((endpoint) => (
                          <SelectItem key={endpoint.value} value={endpoint.value}>
                            {endpoint.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the endpoint to send the request to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sub"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject ID</FormLabel>
                    <FormControl>
                      <Input placeholder="user123" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the user
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="given_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Given Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="family_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email_verified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Email Verified</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+15555555555" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be in E.164 format (e.g., +15555555555)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number_verified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Phone Number Verified</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>

          {/* Display submitted data below form on mobile */}
          <div className="md:hidden mt-8">
            {submittedData && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>JWT Token</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-100 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                      {generateJWT(submittedData)}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>CURL Command</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-100 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                      {generateCurlCommand(submittedData)}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Raw Request Payload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-100 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(submittedData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Implementation Notes */}
        <div className="space-y-6">
          <Alert className="bg-slate-50">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Implementation Notes</AlertTitle>
            <AlertDescription className="mt-4 space-y-4">
              <p>
                This form demonstrates an OpenID Connect (OIDC) registration flow with JWT token generation.
              </p>
              
              <h3 className="font-semibold">Key Features:</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>Follows OpenID Connect Standard Claims specification</li>
                <li>Demonstrates JWT token structure</li>
                <li>Shows CURL command generation for API testing</li>
              </ul>

              <h3 className="font-semibold">Important Notes:</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>JWT tokens are base64 encoded for demonstration only</li>
                <li>In production, JWT signing should be done server-side</li>
                <li>The form includes required and optional OIDC claims</li>
                <li>Timestamps (iat, exp) are automatically generated</li>
              </ul>

              <h3 className="font-semibold">Field Validations:</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>Email must be valid format</li>
                <li>Phone numbers must follow E.164 format</li>
                <li>URLs must be valid (profile, picture, website)</li>
                <li>Required fields: sub, given_name, family_name, email</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Display submitted data on desktop */}
          <div className="hidden md:block">
            {submittedData && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>JWT Token</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-100 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                      {generateJWT(submittedData)}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>CURL Command</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-100 p-4 rounded-lg overflow-auto whitespace-pre-wrap">
                      {generateCurlCommand(submittedData)}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Raw Request Payload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-100 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(submittedData, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 