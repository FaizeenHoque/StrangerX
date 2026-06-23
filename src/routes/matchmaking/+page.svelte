<script lang="ts">
    import { onMount } from 'svelte';

    let scanning = $state(false);
    let blip1 = $state(false);
    let blip2 = $state(false);
    let blip3 = $state(false);

    export function startScan() {
        scanning = true;
        setTimeout(() => blip1 = true, 800);
        setTimeout(() => blip2 = true, 1600);
        setTimeout(() => blip3 = true, 2400);
    }

    export function stopScan() {
        scanning = false;
        blip1 = false;
        blip2 = false;
        blip3 = false;
    }
</script>

<div class="min-h-[calc(100vh-74px)] md:h-[calc(100vh-74px)] flex flex-col md:overflow-hidden">
    <div class="flex-1 flex flex-col md:flex-row md:min-h-0">

        <!-- LEFT PANEL -->
        <div class="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-2 border-accent-primary flex flex-col justify-center items-center px-6 py-8 gap-8">

            <!-- RADAR -->
            <div class="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] shrink-0">

                <!-- Rings -->
                <div class="absolute inset-0 rounded-full border border-[#1e1e1e]"></div>
                <div class="absolute inset-[32px] rounded-full border border-[#1e1e1e]"></div>
                <div class="absolute inset-[65px] rounded-full border border-[#252525]"></div>

                <!-- Crosshairs -->
                <div class="absolute top-1/2 left-0 right-0 h-px bg-[#1e1e1e]"></div>
                <div class="absolute left-1/2 top-0 bottom-0 w-px bg-[#1e1e1e]"></div>

                <!-- Sweep glow -->
                <div class="absolute inset-0 rounded-full origin-center animate-sweep"
                     style="background: conic-gradient(from 0deg, transparent 80%, rgba(232,24,79,0.15) 100%)">
                </div>

                <!-- Sweep line -->
                <div class="absolute top-1/2 left-1/2 w-1/2 h-px origin-left animate-sweep">
                    <div class="w-full h-px bg-gradient-to-r from-transparent to-[#e8184f]"></div>
                </div>

                <!-- Center dot -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-2.5 h-2.5 rounded-full bg-[#e8184f] shadow-[0_0_12px_#e8184f]">
                </div>

                <!-- Blip 1 -->
                <div class="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#e8184f] transition-opacity duration-300
                            -translate-x-1/2 -translate-y-1/2 mt-[-62px] ml-[48px]"
                     class:opacity-0={!blip1} class:opacity-100={blip1}>
                    <div class="absolute -inset-1 rounded-full border border-[#e8184f] animate-blip-ring"></div>
                </div>

                <!-- Blip 2 -->
                <div class="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#e8184f] transition-opacity duration-300
                            -translate-x-1/2 -translate-y-1/2 mt-[30px] ml-[-70px]"
                     class:opacity-0={!blip2} class:opacity-100={blip2}>
                    <div class="absolute -inset-1 rounded-full border border-[#e8184f] animate-blip-ring"></div>
                </div>

                <!-- Blip 3 -->
                <div class="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-[#e8184f] transition-opacity duration-300
                            -translate-x-1/2 -translate-y-1/2 mt-[55px] ml-[20px]"
                     class:opacity-0={!blip3} class:opacity-100={blip3}>
                    <div class="absolute -inset-1 rounded-full border border-[#e8184f] animate-blip-ring"></div>
                </div>

            </div>

            <!-- STATUS TEXT -->
            <div class="text-center">
                <p class="font-mono text-[10px] tracking-[3px] text-[#333] mb-2">
                    > { scanning ? 'SCANNING FOR STRANGERS' : 'MATCHMAKING ENGINE' }
                </p>
                <p class="font-display text-3xl sm:text-4xl font-bold text-white leading-none mb-1">
                    { scanning ? 'SCANNING' : 'READY' }<span class="inline-block w-0.5 h-[0.9em] bg-[#e8184f] ml-0.5 align-middle animate-blink"></span>
                </p>
                <p class="font-mono text-[11px] tracking-[1px] text-[#444]">
                    { scanning ? 'LOOKING FOR A MATCH...' : 'PRESS FIND TO START SCANNING' }
                </p>
            </div>

        </div>

        <!-- RIGHT PANEL -->
        <div class="w-full md:w-1/2 flex flex-col justify-center items-center gap-4 px-4 sm:px-6 py-8">

            <!-- STATS ROW -->
            <div class="flex w-full max-w-sm gap-px">
                <div class="flex-1 bg-brand-surface border border-[#1e1e1e] p-3 sm:p-4 text-center min-w-0">
                    <p class="font-display text-2xl sm:text-3xl font-bold text-[#e8184f] leading-none">1,284</p>
                    <p class="font-mono text-[9px] tracking-[2px] text-[#333] mt-1">ONLINE</p>
                </div>
                <div class="flex-1 bg-brand-surface border border-[#1e1e1e] p-3 sm:p-4 text-center min-w-0">
                    <p class="font-display text-2xl sm:text-3xl font-bold text-[#e8184f] leading-none">47</p>
                    <p class="font-mono text-[9px] tracking-[2px] text-[#333] mt-1">IN QUEUE</p>
                </div>
                <div class="flex-1 bg-brand-surface border border-[#1e1e1e] p-3 sm:p-4 text-center min-w-0">
                    <p class="font-display text-2xl sm:text-3xl font-bold text-[#e8184f] leading-none">392</p>
                    <p class="font-mono text-[9px] tracking-[2px] text-[#333] mt-1">ACTIVE CHATS</p>
                </div>
            </div>

            <!-- FIND BUTTON -->
            <button
                class="w-full max-w-sm border-white mt-2 mb-2 border p-2 hover:cursor-pointer hover:bg-accent-primary hover:text-brand-bg"
                on:click={startScan}
            >
                [FIND A STRANGER]
            </button>

            <!-- TERMINAL LOG -->
            <div class="w-full max-w-sm bg-brand-surface">
                <div>
                    <p class="text-terminal-dim ml-4 mt-4 mb-1 text-left text-sm">// STRANGERX MATCHMAKING ENGINE v1.0</p>
                    <p class="text-terminal-dim ml-4 mb-4 text-left text-sm">// READY. AWAITING COMMAND.</p>
                </div>
            </div>
        </div>
    </div>
</div>