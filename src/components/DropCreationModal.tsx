import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  X, 
  Gift, 
  MessageSquare, 
  CreditCard, 
  User,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Send,
  Edit
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface DropCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onDropCreated: () => void
}

export const DropCreationModal: React.FC<DropCreationModalProps> = ({ 
  isOpen,
  onClose, 
  onDropCreated 
}) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    displayName: 'mightynomandabs',
    upiId: '',
    amount: null as number | null,
    message: ''
  })
  
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const amountOptions = [
    { value: 1, label: '₹1' },
    { value: 5, label: '₹5' },
    { value: 10, label: '₹10' },
    { value: 50, label: '₹50' },
    { value: 100, label: '₹100' }
  ]

  useEffect(() => {
    // Pre-fill display name from user profile
    if (user?.user_metadata?.display_name) {
      setFormData(prev => ({ ...prev, displayName: user.user_metadata.display_name }))
    } else if (user?.email) {
      setFormData(prev => ({ ...prev, displayName: user.email.split('@')[0] }))
    }
  }, [user])

  const validateUPI = (upi: string) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/
    return upiRegex.test(upi)
  }

  const isFormValid = () => {
    return formData.displayName && 
           formData.upiId && 
           validateUPI(formData.upiId) && 
           formData.amount !== null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success animation
    toast.success('Drop sent successfully! 🎉')
    setIsSubmitting(false)
    onClose()
  }

  const handleClose = () => {
    if (isSubmitting) return
    onClose()
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md transform transition-all border border-border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Send a Drop</h2>
              <button
                onClick={handleClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Identity Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent bg-input text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                    placeholder="yourname@provider"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent bg-input text-foreground placeholder:text-muted-foreground ${
                      formData.upiId && !validateUPI(formData.upiId) ? 'border-destructive' : 'border-border'
                    }`}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">Enter your UPI ID for payment processing</p>
                  {formData.upiId && !validateUPI(formData.upiId) && (
                    <p className="text-sm text-destructive mt-1">Please enter a valid UPI ID</p>
                  )}
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {amountOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({...formData, amount: option.value})}
                      className={`py-3 px-2 rounded-lg border-2 font-medium transition-all ${
                        formData.amount === option.value
                          ? 'border-brand-green bg-brand-green/10 text-brand-green'
                          : 'border-border hover:border-border/60 text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Share a kind message with your drop"
                  maxLength={140}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none bg-input text-foreground placeholder:text-muted-foreground"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">Share a kind message with your drop</span>
                  <span className="text-sm text-muted-foreground">{formData.message.length}/140</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold transition-all ${
                  isFormValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-brand-green to-brand-yellow hover:from-brand-green/90 hover:to-brand-yellow/90 text-white transform hover:scale-105'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Send Drop${formData.amount ? ` - ₹${formData.amount}` : ''}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 