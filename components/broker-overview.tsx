"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MessageCircle, CheckCircle2 } from "lucide-react"
import { useApp } from "@/contexts/app-context"
import { useState } from "react"
import { toast } from "sonner"

export function BrokerOverview() {
  const { brokerInfo, workflowSteps, addNotification } = useApp()
  const [assistantEnabled, setAssistantEnabled] = useState(false)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleContact = (method: string) => {
    console.log(`Contacting broker via ${method}`)

    let title = ""
    let description = ""

    switch (method) {
      case "call":
        title = `📞 Calling ${brokerInfo?.name}...`
        description = "Phone: +1 (555) 123-4567 • Initiating VoIP call"
        break
      case "email":
        title = `📧 Opening email to ${brokerInfo?.name}...`
        description = "Email: robert.turner@broker.com • Opening email client"
        break
      case "chat":
        title = `💬 Starting chat with ${brokerInfo?.name}...`
        description = "Opening integrated messaging platform"
        break
      default:
        console.log(`Unknown contact method: ${method}`)
        return
    }

    addNotification(title, description)
    toast.info(title, {
      description,
      duration: 3000,
    })
  }

  const handleAssistantToggle = (enabled: boolean) => {
    setAssistantEnabled(enabled)
    console.log(`AI Assistant ${enabled ? "enabled" : "disabled"}`)

    let title = ""
    let description = ""

    if (enabled) {
      title = "🤖 AI Assistant activated!"
      description = "Smart recommendations, risk assessment, and document processing enabled"
      toast.success(title, {
        description,
        duration: 4000,
      })
    } else {
      title = "AI Assistant deactivated"
      description = "Manual processing mode enabled"
      toast.info(title, {
        description,
        duration: 3000,
      })
    }

    addNotification(title, description)
  }

  if (!brokerInfo) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Broker Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Loading broker information...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Broker Info - Collapsible on mobile */}
      <div className="lg:block">
        <Accordion type="single" collapsible defaultValue="broker" className="lg:hidden">
          <AccordionItem value="broker">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle>Broker Overview</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <BrokerInfoSection />
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>Broker Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 space-y-6">
            <BrokerInfoSection />
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Workflow - Collapsible on mobile */}
      <div className="lg:block">
        <Accordion type="single" collapsible defaultValue="workflow" className="lg:hidden">
          <AccordionItem value="workflow">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle>Onboarding Workflow</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <WorkflowSteps steps={workflowSteps} />
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>

        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle>Onboarding Workflow</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <WorkflowSteps steps={workflowSteps} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BrokerInfoSection() {
  const { brokerInfo } = useApp()
  const [assistantEnabled, setAssistantEnabled] = useState(false)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleContact = (method: string) => {
    // delegate to parent toast/notifications via AppContext-side effects if needed; keep console for tests
    console.log(`Contacting broker via ${method}`)
  }

  const handleAssistantToggle = (enabled: boolean) => {
    setAssistantEnabled(enabled)
    console.log(`AI Assistant ${enabled ? "enabled" : "disabled"}`)
  }

  if (!brokerInfo) return null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">{brokerInfo.name}</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{brokerInfo.deals}</div>
            <div className="text-sm text-muted-foreground">Deals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{brokerInfo.approval_rate}</div>
            <div className="text-sm text-muted-foreground">Approval Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{formatAmount(brokerInfo.pending)}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleContact("call")}>
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleContact("email")}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleContact("chat")}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="ai-assistant" className="text-sm font-medium">
          E Ardsassist
        </Label>
        <Switch id="ai-assistant" checked={assistantEnabled} onCheckedChange={handleAssistantToggle} />
      </div>
    </div>
  )
}

function WorkflowSteps({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            {index + 1}
          </div>
          <span className="text-sm">{step}</span>
          {index < 3 && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
        </div>
      ))}
    </div>
  )
}
