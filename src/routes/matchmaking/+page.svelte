<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { io, type Socket } from 'socket.io-client';
    import { SERVERURL } from "$env/static/private";

    let scanning = $state(false);
    let blip1 = $state(false);
    let blip2 = $state(false);
    let blip3 = $state(false);

    let matched = $state(false);
    let currentMessage = $state('');
    let chatting = $state(false);
    let roomID = $state('');

    let stats = $state({ online: 0, queue: 0, chats: 0 });

    type Message = {
        sender: 'stranger' | 'you' | 'system';
        text: string;
    };

    let messages = $state<Message[]>([
        {
            sender: 'system',
            text: '// CONNECTION ESTABLISHED — BEGIN TRANSMISSION'
        }
    ]);

    let socket: Socket;

    onMount(() => {
        socket = io(SERVERURL)

        socket.on('matched', (data: { roomID: string }) => {
            roomID = data.roomID;
            matched = true;
            stopScan();
        })

        socket.on('message', (message: string) => {
            console.log('message from stranger: ', message);

            messages.push({
                sender: 'stranger',
                text: message
            });
        })

        socket.on('stats_update', (data: { online: number; queue: number; chats: number }) => {
            stats = data;
        });

        socket.on('partner_disconnected', () => {
            messages.push({
                sender: 'system',
                text: '// STRANGER DISCONNECTED'
            })
        })
        
    })

    onDestroy(() => socket?.disconnect());

    export function startScan() {
        scanning = true;
        socket.emit('join_queue');
        setTimeout(() => blip1 = true, 800);
        setTimeout(() => blip2 = true, 1600);
        setTimeout(() => blip3 = true, 2400);
    }

    export function stopScan() {
        scanning = false;
        socket.emit('leave_queue');
        blip1 = false;
        blip2 = false;
        blip3 = false;
    }

    function sendMessage(message: string) {
        if (!message.trim()) return;

        messages.push({
            sender: 'you',
            text: message
        });

        socket.emit('send_message', { roomID, message });
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
                    <p class="font-display text-2xl sm:text-3xl font-bold text-[#e8184f] leading-none">{stats.online}</p>
                    <p class="font-mono text-[9px] tracking-[2px] text-[#333] mt-1">ONLINE</p>
                </div>
                <div class="flex-1 bg-brand-surface border border-[#1e1e1e] p-3 sm:p-4 text-center min-w-0">
                    <p class="font-display text-2xl sm:text-3xl font-bold text-[#e8184f] leading-none">{stats.queue}</p>
                    <p class="font-mono text-[9px] tracking-[2px] text-[#333] mt-1">IN QUEUE</p>
                </div>
                <div class="flex-1 bg-brand-surface border border-[#1e1e1e] p-3 sm:p-4 text-center min-w-0">
                    <p class="font-display text-2xl sm:text-3xl font-bold text-[#e8184f] leading-none">{stats.chats}</p>
                    <p class="font-mono text-[9px] tracking-[2px] text-[#333] mt-1">ACTIVE CHATS</p>
                </div>
            </div>

            <!-- FIND BUTTON -->
            <button
                class="w-full max-w-sm border-white mt-2 mb-2 border p-2 hover:cursor-pointer hover:bg-accent-primary hover:text-brand-bg"
                onclick={scanning ? stopScan : startScan}
            >
                { scanning ? '[STOP SEARCH]' : '[FIND A STRANGER]' }
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


    {#if matched}
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
        <div class="bg-brand-surface border border-accent-primary p-8 flex flex-col items-center gap-4">
            <p class="font-mono text-[10px] tracking-[3px] text-[#333]">MATCH FOUND</p>
            <p class="font-display text-4xl font-bold text-white">CONNECTED</p>
            <p class="font-mono text-[11px] tracking-[1px] text-[#444]">A STRANGER HAS BEEN FOUND</p>
            <button 
                class="w-full border border-white p-2 font-mono text-sm hover:bg-accent-primary hover:text-brand-bg hover:cursor-pointer"
                onclick={() => { matched=false; chatting=true; }}>
                [START CHATTING]
            </button>
        </div>
    </div>
    {/if}


    {#if chatting}
    <div class="fixed inset-0 z-50 bg-brand-bg flex flex-col font-mono">

        <!-- Header -->
        <div class="h-16 border-b border-accent-primary flex items-center justify-between px-6">

            <div>
                <p class="text-ui-small text-gray-500">
                    &gt; SESSION ACTIVE
                </p>

                <p class="text-accent-primary text-sm font-bold">
                    ▪ STRANGER_7F2A
                </p>
            </div>

            <button
                class="border border-white px-5 py-2 text-sm hover:bg-accent-primary hover:text-brand-bg cursor-pointer"
                onclick={() => {
                    chatting = false;
                    socket.disconnect();
                }}
            >
                [DISCONNECT]
            </button>

        </div>


        <!-- Chat area -->
        <div class="flex-1 p-6 overflow-y-auto flex flex-col gap-8" id="chatarea">

        {#each messages as msg}

            {#if msg.sender === 'system'}
                <p class="text-gray-600 text-center text-xs">
                    {msg.text}
                </p>

            {:else if msg.sender === 'stranger'}
                <div>
                    <p class="text-gray-500 text-xs mb-2">
                        STRANGER
                    </p>

                    <p class="inline-block border border-gray-700 p-3 text-white">
                        {msg.text}
                    </p>
                </div>

            {:else}
                <div class="flex justify-end">
                    <div>
                        <p class="text-gray-500 text-xs mb-2 text-right">
                            YOU
                        </p>

                        <p class="inline-block border border-gray-700 p-3 text-white">
                            {msg.text}
                        </p>
                    </div>
                </div>

            {/if}

        {/each}

    </div>


        <!-- Input area -->
        <div class="border-t border-gray-600 p-3 flex gap-3">

            <input
                bind:value={currentMessage}
                type="text"
                placeholder="TYPE A MESSAGE..."
                class="flex-1 bg-brand-bg border border-white p-3 text-white font-mono outline-none focus:border-accent-primary"
                onkeydown={(e) => {
                    if (e.key === 'Enter') {
                        sendMessage(currentMessage);
                        currentMessage = '';
                    }
                }}
            />

            <button
                onclick={() => {
                    sendMessage(currentMessage);
                    currentMessage = '';
                }}
                class="border border-white px-8 hover:bg-accent-primary hover:text-brand-bg cursor-pointer"
            >
                [SEND]
            </button>

        </div>


        <!-- Quick replies -->
        <div class="border-t border-gray-700 p-3 flex gap-4 items-center">

            <span class="text-gray-500 text-xs" >
                Quick Chat
            </span>

            <button class="border border-gray-600 px-5 py-2" onclick={() => {sendMessage("Hey!")}}>
                Hey!
            </button>

            <button class="border border-gray-600 px-5 py-2" onclick={() => {sendMessage("Hru?")}}>
                Hru?
            </button>

            <button class="border border-gray-600 px-5 py-2" onclick={() => {sendMessage("Wyf?")}}>
                Wyf?
            </button>

            <button class="border border-gray-600 px-5 py-2" onclick={() => {sendMessage("Wyd?")}}>
                Wyd?
            </button>

        </div>

    </div>
    {/if}

</div>