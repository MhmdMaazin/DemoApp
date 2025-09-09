"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

interface Borrower {
  id: string
  name: string
  loan_type: string
  amount: number
  status: string
}

interface BorrowerDetail {
  id: string
  name: string
  email: string
  phone: string
  loan_amount: number
  status: string
  employment: string
  income: number
  existing_loan: number
  credit_score: number
  source_of_funds: string
  risk_signal: string
  ai_flags: string[]
}

interface BrokerInfo {
  name: string
  deals: number
  approval_rate: string
  pending: number
}

interface PipelineData {
  new: Borrower[]
  in_review: Borrower[]
  approved: Borrower[]
}

interface Notification {
  id: string
  title: string
  description: string
  timestamp: Date
  read: boolean
}

interface AppContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
  activeBorrower: BorrowerDetail | null
  setActiveBorrower: (borrower: BorrowerDetail | null) => void
  pipelineData: PipelineData
  setPipelineData: (data: PipelineData) => void
  brokerInfo: BrokerInfo | null
  setBrokerInfo: (info: BrokerInfo | null) => void
  workflowSteps: string[]
  setWorkflowSteps: (steps: string[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  notifications: Notification[]
  addNotification: (title: string, description: string) => void
  deleteNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
  markAllAsRead: () => void
  unreadCount: number
  showNotifications: boolean
  setShowNotifications: (show: boolean) => void
  moveToReview: (borrowerId: string) => Promise<void>
  selectBorrower: (borrowerId: string) => Promise<void>
  requestDocuments: (borrowerId: string) => Promise<void>
  sendToValuer: (borrowerId: string) => Promise<void>
  approveLoan: (borrowerId: string) => Promise<void>
  escalateToCommittee: (borrowerId: string) => Promise<void>
  addBorrower: (borrowerData: Omit<BorrowerDetail, "id" | "ai_flags">) => void
  searchBorrowers: (query: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("new")
  const [activeBorrower, setActiveBorrower] = useState<BorrowerDetail | null>(null)
  const [pipelineData, setPipelineData] = useState<PipelineData>({
    new: [],
    in_review: [],
    approved: [],
  })
  const [brokerInfo, setBrokerInfo] = useState<BrokerInfo | null>(null)
  const [workflowSteps, setWorkflowSteps] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const clearSessionStorageOnRefresh = () => {
    if (typeof window !== "undefined") {
      const isPageRefresh = !sessionStorage.getItem("appInitialized")

      if (isPageRefresh) {
        // Clear all borrower data on page refresh
        sessionStorage.removeItem("borrowerDetails")
        console.log("Page refreshed - cleared session storage")
      }

      // Set flag to indicate app is initialized
      sessionStorage.setItem("appInitialized", "true")
    }
  }

  const saveBorrowerToSession = (borrower: BorrowerDetail) => {
    if (typeof window !== "undefined") {
      const existingBorrowers = JSON.parse(sessionStorage.getItem("borrowerDetails") || "{}")
      existingBorrowers[borrower.id] = borrower
      sessionStorage.setItem("borrowerDetails", JSON.stringify(existingBorrowers))
    }
  }

  const getBorrowerFromSession = (id: string): BorrowerDetail | null => {
    if (typeof window !== "undefined") {
      const existingBorrowers = JSON.parse(sessionStorage.getItem("borrowerDetails") || "{}")
      return existingBorrowers[id] || null
    }
    return null
  }

  const addBorrower = (borrowerData: Omit<BorrowerDetail, "id" | "ai_flags">) => {
    const newBorrower: BorrowerDetail = {
      ...borrowerData,
      id: Date.now().toString(),
      ai_flags: [],
    }

    saveBorrowerToSession(newBorrower)

    const pipelineBorrower: Borrower = {
      id: newBorrower.id,
      name: newBorrower.name,
      loan_type: "Home Loan", // Default loan type
      amount: newBorrower.loan_amount,
      status: "New",
    }

    setPipelineData((prev) => ({
      ...prev,
      new: [...prev.new, pipelineBorrower],
    }))

    const notificationTitle = `New borrower added: ${newBorrower.name}`
    const notificationDesc = `Loan amount: $${newBorrower.loan_amount.toLocaleString()}`
    addNotification(notificationTitle, notificationDesc)

    toast.success(notificationTitle, {
      description: notificationDesc,
      duration: 4000,
    })
  }

  const fetchPipelineData = async (): Promise<PipelineData> => {
    return {
      new: [
        {
          id: "1",
          name: "Sarah Dunn",
          loan_type: "Home Loan",
          amount: 300000,
          status: "Renew",
        },
        {
          id: "3",
          name: "Lisa Carter",
          loan_type: "Home Loan",
          amount: 450000,
          status: "New",
        },
      ],
      in_review: [
        {
          id: "2",
          name: "Alan Matthews",
          loan_type: "Personal Loan",
          amount: 20000,
          status: "In Review",
        },
      ],
      approved: [],
    }
  }

  const fetchBorrowerDetail = async (id: string): Promise<BorrowerDetail> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      id,
      name: id === "1" ? "Sarah Dunn" : id === "2" ? "Alan Matthews" : "Lisa Carter",
      email:
        id === "1" ? "sarah.dunn@example.com" : id === "2" ? "alan.matthews@example.com" : "lisa.carter@example.com",
      phone: id === "1" ? "(355)123-4557" : id === "2" ? "(355)123-4558" : "(355)123-4559",
      loan_amount: id === "1" ? 300000 : id === "2" ? 20000 : 450000,
      status: id === "1" ? "New" : id === "2" ? "In Review" : "New",
      employment: "At Tech Company",
      income: 120000,
      existing_loan: 240000,
      credit_score: 720,
      source_of_funds: "Declared",
      risk_signal: "Missing Source of Funds declaration",
      ai_flags: ["Income Inconsistent with Bank statements", "High Debt-to-Income Ratio detected"],
    }
  }

  const fetchBrokerInfo = async (): Promise<BrokerInfo> => {
    return {
      name: "Robert Turner",
      deals: 16,
      approval_rate: "75%",
      pending: 7660,
    }
  }

  const fetchWorkflowSteps = async (): Promise<string[]> => {
    return [
      "Deal Intake",
      "IDV & Credit Check",
      "Document Upload",
      "AI Validation",
      "Credit Committee",
      "Approval & Docs",
      "Funder Syndication",
    ]
  }

  const selectBorrower = async (borrowerId: string) => {
    setIsLoading(true)
    try {
      let borrowerDetail = getBorrowerFromSession(borrowerId)

      if (!borrowerDetail) {
        borrowerDetail = await fetchBorrowerDetail(borrowerId)
        saveBorrowerToSession(borrowerDetail)
      }

      setActiveBorrower(borrowerDetail)
    } catch (error) {
      console.error("Error fetching borrower detail:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const requestDocuments = async (borrowerId: string) => {
    console.log(`Requesting documents for borrower ${borrowerId}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (activeBorrower?.id === borrowerId) {
      const updatedBorrower = {
        ...activeBorrower,
        status: "Documents Requested",
        ai_flags: [...activeBorrower.ai_flags, "Documents requested from borrower"],
      }
      setActiveBorrower(updatedBorrower)
      saveBorrowerToSession(updatedBorrower)
    }

    const notificationTitle = `Documents requested from ${activeBorrower?.name}`
    const notificationDesc = "They will be notified via email and SMS"
    addNotification(notificationTitle, notificationDesc)

    toast.success(notificationTitle, {
      description: notificationDesc,
      duration: 4000,
    })
  }

  const sendToValuer = async (borrowerId: string) => {
    console.log(`Sending borrower ${borrowerId} to valuer`)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (activeBorrower?.id === borrowerId) {
      const updatedBorrower = {
        ...activeBorrower,
        status: "With Valuer",
        ai_flags: [...activeBorrower.ai_flags, "Property valuation in progress"],
      }
      setActiveBorrower(updatedBorrower)
      saveBorrowerToSession(updatedBorrower)
    }

    const notificationTitle = `Sent to valuer: ${activeBorrower?.name}`
    const notificationDesc = "Expected completion: 2-3 business days"
    addNotification(notificationTitle, notificationDesc)

    toast.info(notificationTitle, {
      description: notificationDesc,
      duration: 4000,
    })
  }

  const approveLoan = async (borrowerId: string) => {
    console.log(`Approving loan for borrower ${borrowerId}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (activeBorrower?.id === borrowerId) {
      const updatedBorrower = {
        ...activeBorrower,
        status: "Approved",
      }
      setActiveBorrower(updatedBorrower)
      saveBorrowerToSession(updatedBorrower)

      setPipelineData((prev) => {
        const newData = { ...prev }
        Object.keys(newData).forEach((tab) => {
          newData[tab as keyof PipelineData] = newData[tab as keyof PipelineData].filter((b) => b.id !== borrowerId)
        })
        newData.approved.push({
          id: borrowerId,
          name: activeBorrower.name,
          loan_type: "Home Loan",
          amount: activeBorrower.loan_amount,
          status: "Approved",
        })
        return newData
      })
    }

    const notificationTitle = `🎉 Loan approved for ${activeBorrower?.name}!`
    const notificationDesc = `Amount: $${activeBorrower?.loan_amount.toLocaleString()}`
    addNotification(notificationTitle, notificationDesc)

    toast.success(notificationTitle, {
      description: notificationDesc,
      duration: 5000,
    })
  }

  const escalateToCommittee = async (borrowerId: string) => {
    console.log(`Escalating borrower ${borrowerId} to credit committee`)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (activeBorrower?.id === borrowerId) {
      const updatedBorrower = {
        ...activeBorrower,
        status: "Credit Committee Review",
        ai_flags: [...activeBorrower.ai_flags, "Escalated to Credit Committee for manual review"],
      }
      setActiveBorrower(updatedBorrower)
      saveBorrowerToSession(updatedBorrower)
    }

    const notificationTitle = `Escalated to Credit Committee: ${activeBorrower?.name}`
    const notificationDesc = "They will review within 24 hours"
    addNotification(notificationTitle, notificationDesc)

    toast.warning(notificationTitle, {
      description: notificationDesc,
      duration: 4000,
    })
  }

  const searchBorrowers = async (query: string) => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      toast.info("Enter something to search", { duration: 2500 })
      return
    }

    const lists: Array<keyof PipelineData> = ["new", "in_review", "approved"]
    let found: { tab: keyof PipelineData; id: string; name: string } | null = null

    for (const tab of lists) {
      const match = pipelineData[tab].find((b) => b.name.toLowerCase().includes(normalizedQuery))
      if (match) {
        found = { tab, id: match.id, name: match.name }
        break
      }
    }

    if (!found) {
      toast.error("No borrowers found", { description: `Query: "${query}"`, duration: 3000 })
      return
    }

    setActiveTab(found.tab === "in_review" ? "in_review" : found.tab)
    await selectBorrower(found.id)

    const title = `🔎 Found borrower: ${found.name}`
    const description = `Jumped to ${found.tab.replace("_", " ")}`
    addNotification(title, description)
    toast.success(title, { description, duration: 3000 })
  }

  const moveToReview = async (borrowerId: string) => {
    console.log(`Moving borrower ${borrowerId} to review`)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (activeBorrower?.id === borrowerId) {
      const updatedBorrower = {
        ...activeBorrower,
        status: "In Review",
      }
      setActiveBorrower(updatedBorrower)
      saveBorrowerToSession(updatedBorrower)

      setPipelineData((prev) => {
        const nextData = { ...prev }
        // Remove borrower from all tabs to avoid duplicates
        ;(Object.keys(nextData) as Array<keyof PipelineData>).forEach((tabKey) => {
          nextData[tabKey] = nextData[tabKey].filter((b) => b.id !== borrowerId)
        })

        // Add to in_review if not already present
        if (!nextData.in_review.some((b) => b.id === borrowerId)) {
          nextData.in_review.push({
            id: borrowerId,
            name: updatedBorrower.name,
            loan_type: "Home Loan",
            amount: updatedBorrower.loan_amount,
            status: "In Review",
          })
        }
        return nextData
      })

      setActiveTab("in_review")
    }

    const notificationTitle = `Moved to Review: ${activeBorrower?.name}`
    const notificationDesc = "Application is now under review"
    addNotification(notificationTitle, notificationDesc)

    toast.info(notificationTitle, {
      description: notificationDesc,
      duration: 4000,
    })
  }

  const addNotification = (title: string, description: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      description,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 most recent
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  // Load initial data
  useEffect(() => {
    clearSessionStorageOnRefresh()

    const loadInitialData = async () => {
      try {
        const [pipeline, broker, workflow] = await Promise.all([
          fetchPipelineData(),
          fetchBrokerInfo(),
          fetchWorkflowSteps(),
        ])

        setPipelineData(pipeline)
        setBrokerInfo(broker)
        setWorkflowSteps(workflow)

        // Select first borrower by default
        if (pipeline.new.length > 0) {
          await selectBorrower(pipeline.new[0].id)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("appInitialized")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  const value: AppContextType = {
    activeTab,
    setActiveTab,
    activeBorrower,
    setActiveBorrower,
    pipelineData,
    setPipelineData,
    brokerInfo,
    setBrokerInfo,
    workflowSteps,
    setWorkflowSteps,
    isLoading,
    setIsLoading,
    notifications,
    addNotification,
    deleteNotification,
    markNotificationAsRead,
    markAllAsRead,
    unreadCount,
    showNotifications,
    setShowNotifications,
    moveToReview,
    selectBorrower,
    requestDocuments,
    sendToValuer,
    approveLoan,
    escalateToCommittee,
    addBorrower,
    searchBorrowers,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
