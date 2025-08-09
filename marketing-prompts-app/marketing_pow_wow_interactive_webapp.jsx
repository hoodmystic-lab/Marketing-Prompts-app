import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clipboard, RefreshCcw, Share2 } from "lucide-react";
import { toast } from "sonner";

type FormState = {
  brand: string;
  audience: string;
  problem: string;
  outcome: string;
  category: string;
  differentiator: string;
  proof: string;
  offer: string;
  price: string;
  place: string;
  cta: string;
};

const defaults: FormState = {
  brand: "columbianxchange.com",
  audience: "spiritual entrepreneurs and creators",
  problem: "inconsistent sales and fuzzy messaging",
  outcome: "consistent inquiries and a clear offer",
  category: "practical marketing coaching",
  differentiator: "daily 20-minute habit + receipts-first approach",
  proof: "client screenshots showing 2–5 bookings/week in 30 days",
  offer: "Marketing Pow Wow – Starter Sprint",
  price: "$97 intro or $0 community tier",
  place: "live Zoom + templates via Notion",
  cta: "DM 'START' or book a 10-min intro call",
};

function buildPositioning(s: FormState) {
  return `For ${s.audience} who struggle with ${s.problem}, ${s.brand} offers ${s.category} called “${s.offer}” that delivers ${s.outcome}. We’re different because of ${s.differentiator}, and you can trust it because of ${s.proof}. Start here: ${s.cta}.`;
}

function buildTagline(s: FormState) {
  return `${capitalize(s.outcome)} in minutes a day — not more noise.`;
}

function build4Ps(s: FormState) {
  return [
    `Product: ${s.offer} — ${s.category}. Differentiator: ${s.differentiator}.`,
    `Price: ${s.price}.`,
    `Place: Delivered via ${s.place}.`,
    `Promotion: Lead with proof (${s.proof}). CTA: ${s.cta}.`,
  ];
}

function buildHeadlines(s: FormState) {
  return [
    `How ${capitalize(s.audience)} get ${s.outcome} (without ${s.problem})`,
    `${capitalize(s.outcome)} in 30 days with a ${s.category} you’ll actually use`,
    `Stop ${s.problem}. Start ${s.outcome}.`,
  ];
}

function buildDM(s: FormState) {
  return `Saw your post about ${s.problem}. I help ${s.audience} get ${s.outcome}. Want a 2-step outline?`;
}

function buildAIDA(s: FormState) {
  return [
    `Attention: ${buildHeadlines(s)[0]}`,
    `Interest: Most ${s.audience} struggle with ${s.problem}, leading to missed opportunities and stress.`,
    `Desire: Imagine ${s.outcome}. With ${s.offer}, you’ll get ${s.differentiator}. Proof: ${s.proof}.`,
    `Action: ${s.cta}.`,
  ];
}

function capitalize(s: string){ return s.charAt(0).toUpperCase()+s.slice(1); }

export default function SimpleMessageMaker(){
  const [s, setS] = useState<FormState>(()=>{
    const saved = localStorage.getItem("mpow-simple");
    if(saved){ try { return JSON.parse(saved); } catch {}}
    return defaults;
  });

  useEffect(()=>{
    localStorage.setItem("mpow-simple", JSON.stringify(s));
  },[s]);

  const positioning = useMemo(()=>buildPositioning(s),[s]);
  const ps = useMemo(()=>build4Ps(s),[s]);
  const headlines = useMemo(()=>buildHeadlines(s),[s]);
  const tagline = useMemo(()=>buildTagline(s),[s]);
  const dm = useMemo(()=>buildDM(s),[s]);
  const aida = useMemo(()=>buildAIDA(s),[s]);

  function update<K extends keyof FormState>(k: K, v: FormState[K]){ setS(prev=>({ ...prev, [k]: v })); }
  function copy(t: string){ navigator.clipboard.writeText(t); toast.success("Copied"); }
  function reset(){ setS(defaults); toast.success("Reset"); }
  function share(){
    const link = `${location.origin+location.pathname}#simple=${encodeURIComponent(btoa(JSON.stringify(s)))}`;
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Simple Marketing Message Maker</h1>
            <p className="text-slate-500 text-sm">Powered by STP → Positioning → 4Ps + AIDA</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={share}><Share2 className="w-4 h-4 mr-2"/>Share</Button>
            <Button variant="destructive" onClick={reset}><RefreshCcw className="w-4 h-4 mr-2"/>Reset</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Answer these 10 lines</CardTitle>
              <CardDescription>Each maps to Positioning, 4Ps, and AIDA outputs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(defaults).map((k)=>(
                <Field key={k} label={capitalize(k)} value={s[k as keyof FormState]} onChange={v=>update(k as keyof FormState, v)} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Message</CardTitle>
              <CardDescription>Copy any block to use instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Block title="Positioning Line" text={positioning} />
              <Block title="Tagline" text={tagline} />
              <List title="Headlines" items={headlines} />
              <Block title="DM Opener" text={dm} />
              <List title="4Ps Draft" items={ps} />
              <List title="AIDA Script" items={aida} />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-100">
          <CardHeader>
            <CardTitle>What is AIDA?</CardTitle>
            <CardDescription>A simple model for guiding a customer from awareness to action.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><b>Attention:</b> Grab the audience’s awareness with a hook or striking statement.</p>
            <p><b>Interest:</b> Keep them engaged by showing you understand their needs and pain points.</p>
            <p><b>Desire:</b> Build a want for your offer with benefits, transformations, and proof.</p>
            <p><b>Action:</b> Give a clear, easy next step (CTA).</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-100">
          <CardHeader>
            <CardTitle>What are the 4Ps?</CardTitle>
            <CardDescription>The marketing mix elements you can control.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><b>Product:</b> What you offer to meet the need.</p>
            <p><b>Price:</b> What the customer pays, and the perceived value.</p>
            <p><b>Place:</b> Where and how the product is made available.</p>
            <p><b>Promotion:</b> How you communicate and persuade (ads, PR, content, direct outreach).</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }:{ label:string; value:string; onChange:(v:string)=>void }){
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Input className="mt-2" value={value} onChange={(e)=>onChange(e.target.value)} />
    </div>
  );
}

function Block({ title, text }:{ title:string; text:string }){
  return (
    <Card className="bg-white/70">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button size="sm" variant="secondary" onClick={()=>{navigator.clipboard.writeText(text); toast.success("Copied");}}><Clipboard className="w-4 h-4 mr-2"/>Copy</Button>
      </CardHeader>
      <CardContent>
        <Textarea readOnly className="font-mono" rows={title==="Positioning Line"?5:3} value={text} />
      </CardContent>
    </Card>
  );
}

function List({ title, items }:{ title:string; items:string[] }){
  return (
    <Card className="bg-white/70">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {items.map((t,i)=>(
            <li key={i} className="flex items-start gap-2">
              <span className="flex-1">{t}</span>
              <Button size="sm" variant="secondary" onClick={()=>{navigator.clipboard.writeText(t); toast.success("Copied");}}><Clipboard className="w-4 h-4"/></Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
