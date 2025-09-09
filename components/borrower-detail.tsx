"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Phone, Mail, ArrowRight } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useState } from "react"

export function BorrowerDetail() {
  const { activeBorrower, isLoading, requestDocuments, sendToValuer, approveLoan, escalateToCommittee, moveToReview } =
    useApp()

  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatIncome = (income: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(income)
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

  const shouldEnableEscalate = () => {
    if (!activeBorrower) return false

    // Enable escalate if:
    // 1. Credit score is below 650, OR
    // 2. Debt-to-income ratio is high (existing loan > 80% of income), OR
    // 3. There are AI flags present
    const debtToIncomeRatio = activeBorrower.existing_loan / activeBorrower.income
    return activeBorrower.credit_score < 650 || debtToIncomeRatio > 0.8 || activeBorrower.ai_flags.length > 0
  }

  const handleAction = async (action: () => Promise<void>, actionName: string) => {
    if (!activeBorrower) return

    setActionLoading(actionName)
    try {
      await action()
    } catch (error) {
      console.error(`Error with ${actionName}:`, error)
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!activeBorrower) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Borrower Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Select a borrower to view details</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{activeBorrower.name}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {activeBorrower.email}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {activeBorrower.phone}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-semibold text-lg">{formatAmount(activeBorrower.loan_amount)}</span>
              <Badge className={getStatusColor(activeBorrower.status)}>{activeBorrower.status}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {activeBorrower.status === "New" && (
          <Button
            className="w-full"
            onClick={() => handleAction(() => moveToReview(activeBorrower.id), "move-review")}
            disabled={actionLoading === "move-review"}
          >
            {actionLoading === "move-review" ? (
              "Moving..."
            ) : (
              <>
                Move to Review <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}

        {/* AI Explainability Section */}
        <Accordion type="single" collapsible defaultValue="ai-explainability">
          <AccordionItem value="ai-explainability">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                AI Explainability
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {activeBorrower.ai_flags.map((flag, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{flag}</span>
                  </div>
                ))}

                <div className="space-y-2 mt-4">
                  {activeBorrower.status !== "Approved" && (
                    <>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleAction(() => requestDocuments(activeBorrower.id), "request-documents")}
                          disabled={actionLoading === "request-documents"}
                        >
                          {actionLoading === "request-documents" ? "Requesting..." : "Request Documents"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleAction(() => sendToValuer(activeBorrower.id), "send-valuer")}
                          disabled={actionLoading === "send-valuer"}
                        >
                          {actionLoading === "send-valuer" ? "Sending..." : "Send to Valuer"}
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleAction(() => approveLoan(activeBorrower.id), "approve")}
                        disabled={actionLoading === "approve"}
                      >
                        {actionLoading === "approve" ? "Approving..." : "Approve"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Loan Summary */}
        <div>
          <h3 className="font-semibold mb-4">Loan Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Employment</span>
              <p className="font-medium">{activeBorrower.employment}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Income</span>
              <p className="font-medium">{formatIncome(activeBorrower.income)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Existing Loan</span>
              <p className="font-medium">{formatAmount(activeBorrower.existing_loan)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Credit Score</span>
              <p className="font-medium">{activeBorrower.credit_score}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Source of Funds</span>
              <p className="font-medium">{activeBorrower.source_of_funds}</p>
            </div>
          </div>
        </div>

        {/* Risk Signal */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Risk Signal:</strong> {activeBorrower.risk_signal}
          </AlertDescription>
        </Alert>

        {/* Escalate Button */}
        <Button
          className="w-full"
          variant="destructive"
          onClick={() => handleAction(() => escalateToCommittee(activeBorrower.id), "escalate")}
          disabled={actionLoading === "escalate" || !shouldEnableEscalate()}
        >
          {actionLoading === "escalate" ? "Escalating..." : "Escalate to Credit Committee"}
        </Button>

        {!shouldEnableEscalate() && (
          <p className="text-xs text-muted-foreground text-center">
            Escalation available when credit score &lt; 650, high debt ratio, or AI flags present
          </p>
        )}
      </CardContent>
    </Card>
  )
}
