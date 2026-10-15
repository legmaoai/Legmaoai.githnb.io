/* Small, testable request controller. No customer payload is logged or persisted. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LEGMAOForm = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const endpoint = 'https://formsubmit.co/ajax/legmao.ai@gmail.com';
  function valid(values) {
    return typeof values.name === 'string' && values.name.trim().length > 0 && values.name.length <= 120 &&
      typeof values.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) && values.email.length <= 254 &&
      typeof values.challenge === 'string' && values.challenge.trim().length >= 20 && values.challenge.length <= 4000 &&
      (!values.business || (typeof values.business === 'string' && values.business.length <= 160)) && values.consent === true;
  }
  function create(options = {}) {
    const fetcher = options.fetch || fetch;
    const schedule = options.setTimeout || setTimeout, cancel = options.clearTimeout || clearTimeout;
    const changed = options.onState || (() => {});
    let state = 'idle', active = false, previous = '', uncertain = false;
    const update = (next, detail = {}) => { state = next; changed(next, detail); };
    async function submit(values, acknowledge = false) {
      if (active) return { state: 'submitting', duplicate: true };
      if (!valid(values)) { update('failure', { reason: 'invalid' }); return { state }; }
      if (values.honey) { update('failure', { reason: 'invalid' }); return { state }; }
      const fingerprint = JSON.stringify([values.name, values.email, values.business || '', values.challenge]);
      if (fingerprint === previous) { update('success', { duplicate: true }); return { state, duplicate: true }; }
      if (uncertain && !acknowledge) { update(state === 'timeout' ? 'timeout' : 'failure', { uncertain: true }); return { state, needsAcknowledgment: true }; }
      active = true;
      update('submitting');
      const controller = new AbortController();
      let timer, expired = false;
      const payload = { name: values.name.trim(), email: values.email.trim(), business: values.business?.trim() || '',
        challenge: values.challenge.trim(), consent: 'Yes', _honey: '', _replyto: values.email.trim(),
        _url: 'https://legmaoai.github.io/challenge.html', _subject: 'LEGMAO business challenge' };
      try {
        const deadline = new Promise((resolve, reject) => {
          timer = schedule(() => { expired = true; controller.abort(); reject(new Error('timeout')); }, options.timeoutMs ?? 15000);
        });
        const operation = (async () => {
          const response = await fetcher(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
          const result = await response.json();
          if (!response.ok || !result || (result.success !== true && result.success !== 'true')) throw new Error('unconfirmed');
          return result;
        })();
        await Promise.race([operation, deadline]);
        previous = fingerprint; uncertain = false;
        update('success');
      } catch (error) {
        uncertain = true; // Failure/abort never proves the service did not receive it.
        update(expired ? 'timeout' : 'failure', { uncertain: true });
      } finally { cancel(timer); active = false; }
      return { state, uncertain };
    }
    function edit() { if (!active && !uncertain) update('idle'); }
    return { submit, edit, getState: () => state, isActive: () => active, isUncertain: () => uncertain };
  }
  return { create, valid, endpoint };
});
