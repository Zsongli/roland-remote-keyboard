<script lang="ts">
	import { Robot } from "$lib/roblib";
	import Fa from "svelte-fa";
	import {
		faArrowUp,
		faArrowDown,
		faArrowLeft,
		faArrowRight,
		faArrowRotateLeft
	} from "@fortawesome/free-solid-svg-icons";
	import hold from "$lib/hold";

	var roland: Robot;

	async function initialize(address: string) {
		const promise = Robot.connect(address);
		roland = await promise;
		init = true;
		return promise;
	}

	var prevMovement = { left: 0, right: 0 };
	function updateMove(buttons: Record<string, boolean>) {
		movement = { left: 0, right: 0 };

		if (buttons.w) {
			movement.left += speed;
			movement.right += speed;
		}

		if (buttons.s) {
			movement.left -= speed;
			movement.right -= speed;
		}

		if (buttons.a && !buttons.d) {
			if (!buttons.w && !buttons.s) movement.left += speed;
			movement.right = Math.ceil(movement.right * 0.5);
		}

		if (buttons.d && !buttons.a) {
			if (!buttons.w && !buttons.s) movement.right += speed;
			else movement.left = Math.ceil(movement.left * 0.5);
		}

		if (movement.left == prevMovement.left && movement.right == prevMovement.right) return;
		Object.assign(prevMovement, movement);

		roland.move(movement.right, movement.left);
	}

	var init = false;
	var speed = 50;
	var servo = 0;
	var led = { r: false, g: false, b: false };
	var movement = { left: 0, right: 0 };
	var buttons: Record<string, boolean> = { w: false, a: false, s: false, d: false, e: false };

	$: init && roland.servo(servo);
	$: init && roland.led(led);
	$: init && roland.buzzer(buttons.e ? 69 : 100);
	$: init && updateMove(buttons);
</script>

<svelte:head>
	<title>Roland Remote</title>
</svelte:head>
<svelte:window
	on:keydown={(e) => {
		if (init && Object.keys(buttons).includes(e.key) && !buttons[e.key]) buttons[e.key] = true;
	}}
	on:keyup={(e) => {
		if (init && Object.keys(buttons).includes(e.key) && buttons[e.key]) buttons[e.key] = false;
	}}
/>

{#await initialize("ws://192.168.1.108:1111/ws")}
	<div
		class="animate-none btn btn-ghost btn-lg loading before:h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
	>
		Connecting
	</div>
{:then}
	<div class="m-auto w-full p-16 flex flex-col flex-wrap items-center justify-start gap-8">
		<h1
			class="mb-10 text-xl card-title text-center border border-base-100 shadow-lg p-5 rounded-lg"
		>
			Roland Remote&trade;<br /> <span class="italic text-base">Keyboard Edition&reg;</span>
		</h1>
		<div class="grid grid-rows-2 grid-cols-3 gap-x-3 gap-y-2">
			<div />
			<button
				class="btn btn-primary btn-lg"
				class:btn-active={buttons.w}
				class:scale-95={buttons.w}
				use:hold={0}
				on:hold={() => (buttons.w = true)}
				on:release={() => (buttons.w = false)}><Fa icon={faArrowUp} /></button
			>
			<button
				style="aspect-ratio: 1;"
				class="btn btn-error rounded-full block p-0 text-xs w-[4rem] h-[4rem]"
				class:scale-95={buttons.e}
				use:hold={0}
				on:hold={() => {
					buttons.e = true;
				}}
				on:release={() => {
					buttons.e = false;
				}}>Buzz</button
			>
			<button
				class="btn btn-primary btn-lg"
				class:btn-active={buttons.a}
				class:scale-95={buttons.a}
				use:hold={0}
				on:hold={() => (buttons.a = true)}
				on:release={() => (buttons.a = false)}><Fa icon={faArrowLeft} /></button
			>
			<button
				class="btn btn-primary btn-lg"
				class:btn-active={buttons.s}
				class:scale-95={buttons.s}
				use:hold={0}
				on:hold={() => (buttons.s = true)}
				on:release={() => (buttons.s = false)}><Fa icon={faArrowDown} /></button
			>
			<button
				class="btn btn-primary btn-lg"
				class:btn-active={buttons.d}
				class:scale-95={buttons.d}
				use:hold={0}
				on:hold={() => (buttons.d = true)}
				on:release={() => (buttons.d = false)}><Fa icon={faArrowRight} /></button
			>
		</div>
		<input
			type="range"
			min="0"
			max="100"
			class="range range-lg range-primary w-[240px]"
			bind:value={speed}
		/>

		<div class="border rounded-md p-5 border-neutral shadow-xl bg-base-100">
			<h1 class="text-center font-semibold mb-1">Servo motor rotation</h1>
			<div class="flex items-center-justify-evenly w-full gap-4">
				<span class="font-light">-90°</span>
				<input
					type="range"
					step="5"
					min="-90"
					max="90"
					class="range range-primary w-max"
					bind:value={servo}
				/>
				<span class="font-light">90°</span>
			</div>
		</div>

		<div
			class="border rounded-md border-neutral shadow-xl text-center p-5 pt-2 w-[fit-content] min-w-[150px] bg-base-100"
		>
			<h1 class="mb-5 font-semibold">LEDs</h1>
			<div class="flex justify-evenly items-center gap-10">
				<div class="flex flex-col justify-evenly items-center gap-5">
					<span>Red</span>
					<input type="checkbox" class="toggle checked:bg-red-500" bind:checked={led.r} />
				</div>
				<div class="flex flex-col justify-evenly items-center gap-5">
					<span>Green</span>
					<input type="checkbox" class="toggle checked:bg-green-500" bind:checked={led.g} />
				</div>
				<div class="flex flex-col justify-evenly items-center gap-5">
					<span>Blue</span>
					<input type="checkbox" class="toggle checked:bg-blue-500" bind:checked={led.b} />
				</div>
			</div>
		</div>
	</div>
{:catch error}
	<div
		class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
	>
		<div class="animate-none text-red-600/50 btn btn-error btn-disabled btn-lg">
			{error?.message || "Something went wrong."}
		</div>
		<button
			class="btn btn-primary flex items-center justify-around gap-1"
			on:click={() => window.location.reload()}><Fa icon={faArrowRotateLeft} />Retry</button
		>
	</div>
{/await}
