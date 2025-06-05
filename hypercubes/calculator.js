class Calculator {
	#AgentLevel = undefined;
	#TargetCount = undefined;
	#HyperCount = undefined;
	#RL = undefined;
	#AL = undefined;
	#TargetXM = undefined;
	#HyperXM = undefined;
	#AddCubes = undefined;
	#Slots = undefined;
	#Savings = undefined;
	#MaxSavings = undefined;
	#CubeXM = undefined;
	#ActualXM = undefined;
	#CouldSave = undefined;
	#MoreCubes = undefined;
	#Worth = undefined;

	constructor(AgentLevel, TargetCount, HyperCount) {
		this.#AgentLevel = AgentLevel;
		if ( this.ValidAgentLevel ) {
			this.#AgentLevel = Math.floor(this.#AgentLevel);
		}
		this.#TargetCount = TargetCount;
		this.#HyperCount = HyperCount;

		this.update();
	}

	get ValidAgentLevel() {
		return !isNaN(parseFloat(this.#AgentLevel)) && isFinite(this.#AgentLevel) ;
	}

	get CanCalculate() {
		return !isNaN(parseFloat(this.#TargetCount)) && isFinite(this.#TargetCount) && !isNaN(parseFloat(this.#AgentLevel)) && isFinite(this.#AgentLevel) && !isNaN(parseFloat(this.#HyperCount)) && isFinite(this.#HyperCount) ;
	}

	update() {
		if (this.ValidAgentLevel) {
			this.#Worth = INGRESS_ITEMS.STATS_HYPER[this.#AgentLevel].XM / INGRESS_ITEMS.STATS_POWERCUBE["8"].XM;
		}

		if (this.CanCalculate) {
			this.#TargetCount = Math.floor(this.#TargetCount);
			this.#HyperCount = Math.floor(this.#HyperCount);
			this.#RL = Math.ceil(this.#TargetCount / (INGRESS_ITEMS.STATS_HYPER[this.#AgentLevel].XM / INGRESS_ITEMS.STATS_POWERCUBE["8"].XM));
			this.#AL = this.#HyperCount;
			this.#TargetXM = this.#TargetCount * INGRESS_ITEMS.STATS_POWERCUBE["8"].XM;
			this.#HyperXM = this.#AL * INGRESS_ITEMS.STATS_HYPER[this.#AgentLevel].XM;
			this.#AddCubes = Math.min(this.#TargetCount, Math.max(0, Math.ceil((this.#TargetXM - this.#HyperXM) / INGRESS_ITEMS.STATS_POWERCUBE["8"].XM)));
			this.#Slots = this.#AL + this.#AddCubes;
			this.#Savings = this.#TargetCount - this.#Slots;
			this.#MaxSavings = this.#TargetCount - this.#RL;
			this.#CubeXM = this.#AddCubes * INGRESS_ITEMS.STATS_POWERCUBE["8"].XM;
			this.#ActualXM = this.#HyperXM + this.#CubeXM;
			this.#CouldSave = this.#MaxSavings - this.#Savings;
			this.#MoreCubes = this.#RL - this.#AL;
		}
	}

	get TargetXM() {
		return this.#TargetXM;
	}

	get ActualXM() {
		return this.#ActualXM;
	}

	get HyperXM() {
		return this.#HyperXM;
	}

	get CubeXM() {
		return this.#CubeXM;
	}

	get AL() {
		return this.#AL;
	}

	get AddCubes() {
		return this.#AddCubes;
	}

	get TargetCount() {
		return this.#TargetCount;
	}

	get Savings() {
		return this.#Savings;
	}

	get CouldSave() {
		return this.#CouldSave;
	}

	get MaxSavings() {
		return this.#MaxSavings;
	}

	get MoreCubes() {
		return this.#MoreCubes;
	}

	get AgentLevel() {
		return this.#AgentLevel;
	}

	get HyperCount() {
		return this.#HyperCount;
	}

	get RL() {
		return this.#RL;
	}

	get Slots() {
		return this.#Slots;
	}

	get Worth() {
		return this.#Worth;
	}
}