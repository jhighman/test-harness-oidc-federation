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

const ENDPOINTS = [
  { label: "Local Development", value: "http://localhost:5000/register" },
  { label: "Staging", value: "https://staging.testharness.com/register" },
  { label: "Production", value: "https://testharness.com/register" },
] as const

const formSchema = z.object({
  sub: z.string().min(2).max(50),
  givenName: z.string().min(2).max(50),
  familyName: z.string().min(2).max(50),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: "Phone number must be in E.164 format (e.g., +15555555555)",
  }),
  phoneNumberVerified: z.boolean().default(false),
  iss: z.string().url().default("https://testharness.com"),
  aud: z.string().default("trua_headless"),
  endpoint: z.string().default(ENDPOINTS[0].value),
})

export default function RegisterPage() {
  const [submittedData, setSubmittedData] = useState<z.infer<typeof formSchema> | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sub: "",
      givenName: "",
      familyName: "",
      email: "",
      emailVerified: false,
      phoneNumber: "",
      phoneNumberVerified: false,
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

  function generateCurlCommand(data: z.infer<typeof formSchema>) {
    const { endpoint, ...payload } = data
    return `curl -X POST ${endpoint} \\
     -H "Content-Type: application/json" \\
     -d '${JSON.stringify(payload, null, 2)}'`
  }

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
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
            name="givenName"
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
            name="familyName"
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
            name="emailVerified"
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
            name="phoneNumber"
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
            name="phoneNumberVerified"
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

      {submittedData && (
        <div className="w-full max-w-md space-y-6">
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
  )
} 