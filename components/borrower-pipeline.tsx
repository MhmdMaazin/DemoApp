"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/app-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function BorrowerPipeline() {
  const { activeTab, setActiveTab, pipelineData, activeBorrower, selectBorrower, addNotification } = useApp()

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "renew":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getBorrowersByTab = () => {
    switch (activeTab) {
      case "new":
        return pipelineData.new
      case "in_review":
        return pipelineData.in_review
      case "approved":
        return pipelineData.approved
      default:
        return []
    }
  }

  const handleFilterChange = (value: string) => {
    console.log(`Filter changed to: ${value}`)
    const title = `Filter changed to: ${value}`
    const description = "This would filter borrowers by active/inactive status"
    addNotification(title, description)
    toast.info(title, {
      description,
      duration: 3000,
    })
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Borrower Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new">New ({pipelineData.new.length})</TabsTrigger>
            <TabsTrigger value="in_review">In Review ({pipelineData.in_review.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({pipelineData.approved.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-3">
              {getBorrowersByTab().map((borrower) => (
                <div
                  key={borrower.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                    activeBorrower?.id === borrower.id && "bg-muted border-primary",
                  )}
                  onClick={() => selectBorrower(borrower.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{borrower.name}</h3>
                      <p className="text-sm text-muted-foreground">{borrower.loan_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatAmount(borrower.amount)}</p>
                      <Badge className={cn("text-xs", getStatusColor(borrower.status))}>{borrower.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            F-SANITISED ACTIVE
          </h4>
          <RadioGroup defaultValue="active" onValueChange={handleFilterChange} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active" className="text-sm">
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inactive" id="inactive" />
              <Label htmlFor="inactive" className="text-sm">
                Inactive
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
