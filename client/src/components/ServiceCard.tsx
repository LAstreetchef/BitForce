import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ServiceData {
  id: string;
  name: string;
  keywords: string[];
  questions: string[];
  talkingPoints: string;
  icon: React.ElementType;
}

interface ServiceCardProps {
  service: ServiceData;
  isSuggested?: boolean;
}

export function ServiceCard({ service, isSuggested }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ y: -5 }}
          className={`
            relative cursor-pointer group rounded-2xl p-6 h-full border transition-all duration-300
            ${
              isSuggested
                ? "bg-blue-50/50 border-blue-200 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50"
            }
          `}
        >
          {isSuggested && (
            <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-600/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Suggested
            </div>
          )}

          <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 w-fit group-hover:from-blue-50 group-hover:to-blue-100 transition-colors duration-300">
            <Icon className="w-8 h-8 text-slate-700 group-hover:text-blue-600 transition-colors duration-300" />
          </div>

          <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">
            {service.name}
          </h3>
          
          <p className="text-slate-500 text-sm line-clamp-2 mb-4">
            Click to view qualification questions and sales talking points for {service.name}.
          </p>

          <div className="flex items-center text-sm font-semibold text-blue-600 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            View Details <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Icon className="w-6 h-6" />
            </div>
            <DialogTitle className="text-2xl">{service.name}</DialogTitle>
          </div>
          <DialogDescription>
            Use this guide to qualify the lead and present the value proposition.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 py-4">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Key Questions to Ask
              </h4>
              <ul className="space-y-3">
                {service.questions.map((q, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-blue-500 shrink-0">{i + 1}.</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sales Talking Points
              </h4>
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-slate-700 leading-relaxed whitespace-pre-line">
                {service.talkingPoints}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
