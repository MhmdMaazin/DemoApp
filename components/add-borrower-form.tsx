"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { useApp } from "@/contexts/app-context"

const addBorrowerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  loan_amount: z.number().min(1000, "Loan amount must be at least $1,000"),
  employment: z.string().min(2, "Employment information is required"),
  income: z.number().min(1, "Annual income is required"),
  existing_loan: z.number().min(0, "Existing loan amount cannot be negative"),
  credit_score: z.number().min(300).max(850, "Credit score must be between 300-850"),
  source_of_funds: z.string().min(2, "Source of funds is required"),
  risk_signal: z.string().optional(),
})

type AddBorrowerFormData = z.infer<typeof addBorrowerSchema>

interface AddBorrowerFormProps {
  onClose: () => void
}

export function AddBorrowerForm({ onClose }: AddBorrowerFormProps) {
  const { addBorrower } = useApp()

  const form = useForm<AddBorrowerFormData>({
    resolver: zodResolver(addBorrowerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      loan_amount: 0,
      employment: "",
      income: 0,
      existing_loan: 0,
      credit_score: 700,
      source_of_funds: "",
      risk_signal: "",
    },
  })

  const onSubmit = (data: AddBorrowerFormData) => {
    addBorrower({
      ...data,
      status: "New",
      risk_signal: data.risk_signal || "No risk signals detected",
    })
    form.reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Add New Borrower</CardTitle>
            <CardDescription>Enter borrower information to add them to the pipeline</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
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
                        <Input {...field} type="email" placeholder="john@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(555) 123-4567" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loan_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="300000"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Software Engineer at Tech Corp" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="120000"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="existing_loan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Existing Loan ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="50000"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credit_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Score</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="300"
                          max="850"
                          placeholder="720"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="source_of_funds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source of Funds</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source of funds" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Declared">Declared</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Investment">Investment</SelectItem>
                        <SelectItem value="Gift">Gift</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="risk_signal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Signal (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Any risk indicators or notes" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Add Borrower</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
