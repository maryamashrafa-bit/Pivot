'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { TextInputStep, ContextInputStep } from '@/components/decision/TextInputStep';
import { ChipsStep } from '@/components/decision/ChipsStep';
import { WeightsStep } from '@/components/decision/WeightsStep';
import { ScoreStep } from '@/components/decision/ScoreStep';
import { ResultsView } from '@/components/decision/ResultsView';
import { FinalActions } from '@/components/decision/FinalActions';
import { computeResults } from '@/lib/scoring';
import { emptyDecisionState, type DecisionState } from '@/lib/types';

interface ChatMessage {
  id: number;
  role: 'pivot' | 'user' | 'loading';
  node: ReactNode;
  typing: boolean;
}

const FALLBACK_SUGGESTIONS = [
  'Daily time commitment',
  'Financial impact',
  'Career progression',
  'Job security',
  'Family time impact',
  'Commute demands',
  'Side project time',
  'Work flexibility',
  'Team environment',
  'Learning opportunities',
  'Pension & benefits',
  'Entrepreneurial freedom',
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function DecisionChat({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputArea, setInputArea] = useState<ReactNode>(null);
  const idRef = useRef(0);
  const started = useRef(false);
  const S = useRef<DecisionState>(emptyDecisionState());

  function scrollSoon() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 60);
  }

  async function addPivot(node: ReactNode, delayMs = 0) {
    if (delayMs) await sleep(delayMs);
    const id = idRef.current++;
    setMessages((m) => [...m, { id, role: 'pivot', node: null, typing: true }]);
    scrollSoon();
    await sleep(700);
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, node, typing: false } : msg)));
    scrollSoon();
  }

  async function addPivotInstant(node: ReactNode, delayMs = 0) {
    if (delayMs) await sleep(delayMs);
    const id = idRef.current++;
    setMessages((m) => [...m, { id, role: 'pivot', node, typing: false }]);
    scrollSoon();
  }

  function addUser(node: ReactNode) {
    const id = idRef.current++;
    setMessages((m) => [...m, { id, role: 'user', node, typing: false }]);
    scrollSoon();
  }

  function addLoading(label: string) {
    const id = idRef.current++;
    setMessages((m) => [...m, { id, role: 'loading', node: label, typing: false }]);
    scrollSoon();
    return id;
  }

  function removeMessage(id: number) {
    setMessages((m) => m.filter((msg) => msg.id !== id));
  }

  function waitForInput<T>(render: (resolve: (value: T) => void) => ReactNode): Promise<T> {
    return new Promise((resolve) => {
      setInputArea(
        render((value: T) => {
          setInputArea(null);
          resolve(value);
        })
      );
    });
  }

  async function fetchSuggestions(title: string, optA: string, optB: string, context: string) {
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, optA, optB, context }),
      });
      const data = await res.json();
      if (Array.isArray(data.suggestions) && data.suggestions.length >= 8) {
        return data.suggestions as string[];
      }
      throw new Error('bad response');
    } catch {
      return FALLBACK_SUGGESTIONS;
    }
  }

  async function run() {
    // --- decision title ---
    await addPivot(
      <>
        Hi there. I&apos;m <em>Pivot</em> — a calm thinking partner for big decisions.
      </>,
      0
    );
    await addPivot(
      'I’ll ask you a few simple questions, one at a time. No rush, no right answers, no judgement here.',
      900
    );
    await addPivot(
      <>
        One thing before we start: we&apos;re going to focus on what matters to you{' '}
        <em>right now</em> — in your life as it actually is today, not an ideal future version of
        it. That&apos;s where the clarity lives.
      </>,
      1800
    );
    await addPivot(
      <>
        So — <em>what&apos;s the decision you&apos;re facing?</em>
      </>,
      2900
    );
    const title = await waitForInput<string>((resolve) => (
      <TextInputStep placeholder="e.g. Should I change jobs?" onSubmit={resolve} />
    ));
    S.current.title = title;
    addUser(title);

    // --- option A ---
    await addPivot(
      <>
        Got it — <em>&quot;{title}&quot;</em>. That sounds like a significant one.
      </>,
      300
    );
    await addPivot(
      <>
        Let&apos;s give your two options clear names. <em>What&apos;s option A?</em>
      </>,
      1200
    );
    const optA = await waitForInput<string>((resolve) => (
      <TextInputStep placeholder="e.g. Stay in current role" onSubmit={resolve} />
    ));
    S.current.optA = optA;
    addUser(optA);

    // --- option B ---
    await addPivot(
      <>
        And <em>what&apos;s option B?</em>
      </>,
      400
    );
    const optB = await waitForInput<string>((resolve) => (
      <TextInputStep placeholder="e.g. Take the new job" onSubmit={resolve} />
    ));
    S.current.optB = optB;
    addUser(optB);

    // --- context ---
    await addPivot(
      <>
        &quot;<em>{optA}</em>&quot; vs &quot;<em>{optB}</em>&quot;. Before I suggest what to
        consider, I&apos;d love to understand your situation.
      </>,
      400
    );
    await addPivot(
      <>
        In a sentence or two — <em>tell me a little about yourself and your life right now.</em>{' '}
        Things like family situation, how long you&apos;ve been in your current role, other
        commitments, what worries you most. The more you share, the more tailored my suggestions
        will be.
      </>,
      1300
    );
    const context = await waitForInput<string>((resolve) => <ContextInputStep onSubmit={resolve} />);
    S.current.context = context;
    addUser(context || 'Keeping it private');

    // --- suggestions ---
    await addPivot(
      context
        ? 'Thank you — that really helps me understand what matters for you specifically.'
        : 'No problem at all — I’ll work with what I have.',
      300
    );
    await addPivot('Let me think carefully about what actually matters here...', 1100);
    await sleep(600);
    const loadingId = addLoading('Personalising your suggestions...');
    const suggestions = await fetchSuggestions(title, optA, optB, context);
    S.current.suggestions = suggestions;
    removeMessage(loadingId);
    await addPivot(
      'Here’s what I think matters for your specific situation. Tap to select the ones that resonate — remove any that don’t apply, and add your own if something’s missing.',
      0
    );
    await sleep(800);
    const crit = await waitForInput<string[]>((resolve) => (
      <ChipsStep suggestions={suggestions} onSubmit={resolve} />
    ));
    S.current.crit = crit;
    addUser(crit.join(', '));

    // --- weights ---
    await addPivot(
      <>
        Good choices. Now — thinking about your life <em>right now</em>, how important is each
        one to you? Just move the slider honestly. No right answers.
      </>,
      400
    );
    await sleep(1200);
    const wts = await waitForInput<Record<string, number>>((resolve) => (
      <WeightsStep criteria={crit} onSubmit={resolve} />
    ));
    S.current.wts = wts;
    const top = [...crit].sort((a, b) => (wts[b] ?? 5) - (wts[a] ?? 5)).slice(0, 3);
    addUser(`Most important to me right now: ${top.join(', ')}`);

    // --- blind scoring: option A ---
    await addPivot(
      <>
        I can see what matters most to you right now — especially <em>{top.join(', ')}</em>.
      </>,
      400
    );
    await addPivot(
      'Now we’ll score each option separately — one at a time, so you’re not influenced by seeing both at once. This keeps your answers honest.',
      1300
    );
    await addPivot(
      <>
        Starting with <em>&quot;{optA}&quot;</em>. For each factor, how well does this option
        deliver? 1 is poor, 10 is excellent.
      </>,
      2200
    );
    await sleep(900);
    const scA = await waitForInput<Record<string, number>>((resolve) => (
      <ScoreStep
        side="a"
        optLabel={optA}
        criteria={crit}
        doneLabel={`Done — now score "${optB}"`}
        onSubmit={resolve}
      />
    ));
    S.current.scA = scA;
    addUser(`"${optA}" scored`);

    // --- blind scoring: option B ---
    await addPivot(
      <>
        Good. Now the same for <em>&quot;{optB}&quot;</em> — fresh eyes, same questions.
      </>,
      400
    );
    await sleep(800);
    const scB = await waitForInput<Record<string, number>>((resolve) => (
      <ScoreStep side="b" optLabel={optB} criteria={crit} doneLabel="See my results" onSubmit={resolve} />
    ));
    S.current.scB = scB;
    addUser(`"${optB}" scored`);

    // --- results ---
    await addPivot('Both options scored. Let me put the full picture together for you now.', 400);
    await addPivotInstant(
      <ResultsView optA={optA} optB={optB} crit={crit} wts={wts} scA={scA} scB={scB} />,
      1400
    );

    const result = computeResults(optA, optB, crit, wts, scA, scB);
    await addPivot(result.closingMessage, 800);
    await sleep(2000);

    setInputArea(
      <FinalActions
        title={title}
        optA={optA}
        optB={optB}
        context={context}
        crit={crit}
        wts={wts}
        scA={scA}
        scB={scB}
        scoreA={result.scoreA}
        scoreB={result.scoreB}
        winner={result.winner}
        isAuthenticated={isAuthenticated}
        onRestart={restart}
      />
    );
  }

  function restart() {
    S.current = emptyDecisionState();
    setMessages([]);
    setInputArea(null);
    run();
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="bubble-wrap">
        {messages.map((m) => {
          if (m.role === 'loading') {
            return (
              <div key={m.id} className="bubble pivot-bubble">
                <div className="ai-loading">
                  <span />
                  <span />
                  <span />
                  &nbsp;{m.node}
                </div>
              </div>
            );
          }
          if (m.typing) {
            return (
              <div key={m.id} className="bubble pivot-bubble">
                <div className="typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className={'bubble ' + (m.role === 'pivot' ? 'pivot-bubble' : 'user-bubble')}>
              <div className="binner">{m.node}</div>
            </div>
          );
        })}
      </div>
      <div className="input-area">{inputArea}</div>
    </>
  );
}
