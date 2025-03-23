import React from "react"
import { CheckCircle2 } from "lucide-react"
import { cn } from "../lib/utils"

export interface StepType {
  id: number
  title: string
}

interface StepperProps {
  steps: StepType[]
  currentStep: number
  className?: string
}

function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  currentStep > step.id
                    ? "bg-green-100 border-green-500 text-green-500"
                    : currentStep === step.id
                    ? "border-[#F2FD7D] bg-[#F2FD7D]/30 text-[#28443f]"
                    : "border-gray-300 text-gray-300"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "absolute -bottom-6 text-xs font-medium whitespace-nowrap",
                  currentStep === step.id ? "text-[#28443f]" : "text-gray-500"
                )}
              >
                {step.title}
              </span>
            </div>

            {/* Connector line between steps */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-auto border-t-2 transition-colors duration-300 mx-1",
                  currentStep > step.id ? "border-green-500" : "border-gray-300"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export { Stepper, type StepType as Step }