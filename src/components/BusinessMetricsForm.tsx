import { useState, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BusinessMetrics, businessMetricsSchema } from "@/lib/schemas";
import { industryPresets } from "@/lib/industryPresets";
import { MetricHelpTooltip } from "./MetricHelpTooltip";
import { Calculator, RotateCcw, HelpCircle } from "lucide-react";

interface BusinessMetricsFormProps {
  onCalculate: (metrics: BusinessMetrics) => void;
}

export interface BusinessMetricsFormRef {
  setIndustry: (industry: string) => void;
}

export const BusinessMetricsForm = forwardRef<BusinessMetricsFormRef, BusinessMetricsFormProps>(
  ({ onCalculate }, ref) => {
    const [selectedIndustry, setSelectedIndustry] = useState("custom");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BusinessMetrics>({
    resolver: zodResolver(businessMetricsSchema),
    defaultValues: {
      contractValue: 0,
      monthlyRecurring: 0,
      serviceDeliveryCosts: 0,
      monthlyServiceCosts: 0,
      retentionMonths: 24,
      closeRate: 20,
      estimatedCPL: 35,
    },
  });

  const handleIndustryChange = (industry: string, autoSubmit = false) => {
    setSelectedIndustry(industry);
    const preset = industryPresets[industry];
    if (preset && industry !== "custom") {
      setValue("contractValue", preset.contractValue);
      setValue("monthlyRecurring", preset.monthlyRecurring);
      setValue("serviceDeliveryCosts", preset.serviceDeliveryCosts);
      setValue("monthlyServiceCosts", preset.monthlyServiceCosts);
      setValue("retentionMonths", preset.retentionMonths);
      setValue("closeRate", preset.closeRate);
      setValue("estimatedCPL", preset.estimatedCPL);
      
      // Auto-submit if triggered from industry buttons
      if (autoSubmit) {
        setTimeout(() => {
          handleSubmit(onCalculate)();
        }, 100);
      }
    }
  };

  const handleReset = () => {
    setSelectedIndustry("custom");
    reset();
  };

  // Expose method to parent component
  useImperativeHandle(ref, () => ({
    setIndustry: (industry: string) => {
      handleIndustryChange(industry, true);
    },
  }));

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">Calculate Your ROI</h3>
        <p className="text-sm text-muted-foreground">
          Enter your business metrics or select an industry preset to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onCalculate)} className="space-y-6">
        <div>
          <Label htmlFor="industry" className="flex items-center">
            Select Industry
          </Label>
          <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
            <SelectTrigger id="industry" className="mt-2">
              <SelectValue placeholder="Choose an industry" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(industryPresets).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Use industry estimates or enter custom values below
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contractValue" className="flex items-center">
              Contract Value ($)
              <MetricHelpTooltip metricKey="contractValue" />
            </Label>
            <Input
              id="contractValue"
              type="number"
              step="0.01"
              {...register("contractValue", { valueAsNumber: true })}
              className="mt-2"
              placeholder="e.g., 2500"
            />
            {errors.contractValue && (
              <p className="text-xs text-destructive mt-1">{errors.contractValue.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="monthlyRecurring" className="flex items-center">
              Monthly Recurring Revenue ($)
              <MetricHelpTooltip metricKey="monthlyRecurring" />
            </Label>
            <Input
              id="monthlyRecurring"
              type="number"
              step="0.01"
              {...register("monthlyRecurring", { valueAsNumber: true })}
              className="mt-2"
              placeholder="e.g., 55"
            />
            {errors.monthlyRecurring && (
              <p className="text-xs text-destructive mt-1">{errors.monthlyRecurring.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="serviceDeliveryCosts" className="flex items-center">
              Service Delivery Costs ($)
              <MetricHelpTooltip metricKey="serviceDeliveryCosts" />
            </Label>
            <Input
              id="serviceDeliveryCosts"
              type="number"
              step="0.01"
              {...register("serviceDeliveryCosts", { valueAsNumber: true })}
              className="mt-2"
              placeholder="e.g., 800"
            />
            {errors.serviceDeliveryCosts && (
              <p className="text-xs text-destructive mt-1">{errors.serviceDeliveryCosts.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="monthlyServiceCosts" className="flex items-center">
              Monthly Service Costs ($)
              <MetricHelpTooltip metricKey="monthlyServiceCosts" />
            </Label>
            <Input
              id="monthlyServiceCosts"
              type="number"
              step="0.01"
              {...register("monthlyServiceCosts", { valueAsNumber: true })}
              className="mt-2"
              placeholder="e.g., 20"
            />
            {errors.monthlyServiceCosts && (
              <p className="text-xs text-destructive mt-1">{errors.monthlyServiceCosts.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="retentionMonths" className="flex items-center">
              Customer Retention (months)
              <MetricHelpTooltip metricKey="retentionMonths" />
            </Label>
            <Input
              id="retentionMonths"
              type="number"
              {...register("retentionMonths", { valueAsNumber: true })}
              className="mt-2"
              placeholder="e.g., 30"
            />
            {errors.retentionMonths && (
              <p className="text-xs text-destructive mt-1">{errors.retentionMonths.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="closeRate" className="flex items-center">
              Lead-to-Customer Close Rate (%)
              <MetricHelpTooltip metricKey="closeRate" />
            </Label>
            <Input
              id="closeRate"
              type="number"
              step="0.1"
              {...register("closeRate", { valueAsNumber: true })}
              className="mt-2"
              placeholder="e.g., 20"
            />
            {errors.closeRate && (
              <p className="text-xs text-destructive mt-1">{errors.closeRate.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="estimatedCPL" className="flex items-center">
              Estimated CPL ($) <span className="text-muted-foreground ml-1">(optional)</span>
              <MetricHelpTooltip metricKey="cpl" />
            </Label>
            <Input
              id="estimatedCPL"
              type="number"
              step="0.01"
              {...register("estimatedCPL", { valueAsNumber: true })}
              className="mt-2"
              placeholder="Leave blank to use tier defaults"
            />
            {errors.estimatedCPL && (
              <p className="text-xs text-destructive mt-1">{errors.estimatedCPL.message}</p>
            )}
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full border border-border rounded-lg">
          <AccordionItem value="help" className="border-0">
            <AccordionTrigger className="px-4 hover:no-underline">
              <span className="text-sm font-medium text-foreground">Need Help? Click for guidance</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-3">
              <div className="space-y-2 text-sm">
                <p className="font-medium text-foreground">Quick Tips:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Don't know your numbers? Select an industry preset above</li>
                  <li>Hover over the <HelpCircle className="w-3 h-3 inline" /> icons for detailed explanations</li>
                  <li>All fields are required except Estimated CPL</li>
                </ul>
              </div>
              
              <div className="space-y-2 text-sm pt-2">
                <p className="font-medium text-foreground">Finding Your Numbers:</p>
                <div className="space-y-2">
                  <details className="text-muted-foreground">
                    <summary className="cursor-pointer font-medium text-foreground">Contract Value</summary>
                    <p className="mt-1 pl-4">Check past invoices for installation fees, average your last 10-20 customer contracts, and include equipment, labor, and permits.</p>
                  </details>
                  <details className="text-muted-foreground">
                    <summary className="cursor-pointer font-medium text-foreground">Customer Retention</summary>
                    <p className="mt-1 pl-4">Review customer database for average lifespan, count months from signup to cancellation. Industry average: 24-36 months.</p>
                  </details>
                  <details className="text-muted-foreground">
                    <summary className="cursor-pointer font-medium text-foreground">Close Rate</summary>
                    <p className="mt-1 pl-4">Formula: (Customers Won / Total Leads) × 100. Check your CRM reports for conversion data. Industry average: 15-25%.</p>
                  </details>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" size="lg">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate ROI
          </Button>
          <Button type="button" variant="outline" onClick={handleReset} size="lg">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
});

BusinessMetricsForm.displayName = "BusinessMetricsForm";
