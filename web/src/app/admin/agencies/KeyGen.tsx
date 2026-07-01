"use client";

import { useActionState } from "react";
import { createApiKeyAction } from "../actions";

export function KeyGen({ buyerId }: { buyerId: string }) {
  const [state, action, pending] = useActionState(createApiKeyAction, {});

  return (
    <div>
      <form action={action}>
        <input type="hidden" name="buyerId" value={buyerId} />
        <button
          disabled={pending}
          className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50"
        >
          {pending ? "Generating…" : "+ Generate API key"}
        </button>
      </form>

      {state.raw && (
        <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-800">
            Copy this key now — it won&apos;t be shown again:
          </p>
          <code className="mt-1 block break-all rounded bg-white px-2 py-1 text-xs">
            {state.raw}
          </code>
        </div>
      )}
      {state.error && (
        <p className="mt-2 text-xs text-red-600">{state.error}</p>
      )}
    </div>
  );
}
