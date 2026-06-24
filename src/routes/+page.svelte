<script lang="ts">
    import { onMount } from "svelte";

    onMount(() => {
        
    });

    function loginWithHackclub() {
        window.location.href = "/login";
    }

    function guestlogin() {
        window.location.href = "/guestlogin"
    }
</script>

<div class="min-h-screen flex flex-col">
    <div class="flex-1 flex flex-col md:flex-row">
        <!-- LEFT PANEL -->
        <div class="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-2 border-accent-primary flex flex-col justify-center items-center py-12 px-6">
            <div>
                <p class="text-accent-primary tracking-hacker-micro text-[13px] sm:text-[15px]">
                    > ANONYMOUS CHAT PROTOCOL
                </p>

                <h1 class="font-mono-chrome font-extrabold text-4xl sm:text-5xl lg:text-7xl pt-4 pb-5 text-center">
                    TALK TO A <br/>
                    <span class="terminal-cursor text-accent-primary">STRANGER_</span>
                </h1>

                <ul class="text-terminal-dim text-sm sm:text-base">
                    <li class="p-[0.6px]">> ENCRYPTED CONNECTION</li>
                    <li class="p-[0.6px]">> NO LOGS NO TRACES</li>
                    <li class="p-[0.6px]">> RANDOM MATCH WORLD WIDE</li>
                    <li class="p-[0.6px]">> DISCONNECT <span class="text-accent-primary">ANYTIME</span></li>
                </ul>
            </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="w-full md:w-1/2 flex flex-col justify-center items-center gap-4 py-12 px-6">
            <div class="w-full max-w-xs">
                <p class="text-terminal-dim mt-4 mb-4">> SELECT AUTH METHOD</p>
                <button class="w-full border-white border-2 p-2 hover:cursor-pointer hover:bg-accent-primary hover:text-brand-bg" onclick={loginWithHackclub}>
                    [LOGIN WITH HACKCLUB]
                </button>
                <p class="text-terminal-dim mt-4 mb-4 text-center text-[10px]">or</p>
                <button class="w-full border-white border-2 p-2 hover:cursor-pointer hover:bg-accent-primary hover:text-brand-bg" onclick={guestlogin}>
                    [LOGIN AS A GUEST]
                </button> 
                <p class="text-terminal-dim mt-4 mb-4 text-center text-sm">
                    HACKCLUB LOGIN SAVES YOUR SESSION. GUESTS GET A RANDOM ID, NO HISTORY.
                </p>
            </div>
        </div>
    </div>
</div>