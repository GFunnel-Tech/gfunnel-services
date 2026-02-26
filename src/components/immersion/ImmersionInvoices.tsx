import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, Receipt, FileSignature } from "lucide-react";
import { useInvoices } from "@/hooks/useImmersion";
import { formatCurrency } from "@/lib/walletService";
import { INVOICE_STATUS_CONFIG } from "@/lib/immersionTypes";
import type { InvoiceStatus } from "@/lib/immersionTypes";

interface ImmersionInvoicesProps {
  engagementId: string;
}

export function ImmersionInvoices({ engagementId }: ImmersionInvoicesProps) {
  const { data: allInvoices, isLoading } = useInvoices(engagementId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const invoices = allInvoices?.filter((i) => i.type === "invoice") || [];
  const agreements = allInvoices?.filter((i) => i.type === "agreement") || [];

  if (invoices.length === 0 && agreements.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Invoices Yet</h3>
        <p className="text-muted-foreground">
          Invoices and agreements will appear here once created.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Invoices Section */}
      {invoices.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Invoices</h3>
          </div>
          <div className="space-y-3">
            {invoices.map((invoice) => {
              const statusConfig = INVOICE_STATUS_CONFIG[invoice.status as InvoiceStatus] || INVOICE_STATUS_CONFIG.pending;

              return (
                <Card key={invoice.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium">{invoice.invoice_number}</span>
                        <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{invoice.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {invoice.issued_date && (
                          <span>Issued: {new Date(invoice.issued_date).toLocaleDateString()}</span>
                        )}
                        {invoice.due_date && (
                          <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                        )}
                        {invoice.paid_date && (
                          <span>Paid: {new Date(invoice.paid_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {invoice.amount != null && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold">{formatCurrency(invoice.amount)}</p>
                        <p className="text-xs text-muted-foreground">{invoice.currency}</p>
                      </div>
                    )}

                    {invoice.document_url && (
                      <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" asChild>
                        <a href={invoice.document_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                          PDF
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Agreements Section */}
      {agreements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileSignature className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Agreements</h3>
          </div>
          <div className="space-y-3">
            {agreements.map((agreement) => {
              const statusConfig = INVOICE_STATUS_CONFIG[agreement.status as InvoiceStatus] || INVOICE_STATUS_CONFIG.pending;

              return (
                <Card key={agreement.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FileSignature className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-medium">{agreement.invoice_number}</span>
                        <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{agreement.description}</p>
                    </div>

                    {agreement.document_url && (
                      <Button variant="outline" size="sm" className="gap-2 flex-shrink-0" asChild>
                        <a href={agreement.document_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                          View
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
