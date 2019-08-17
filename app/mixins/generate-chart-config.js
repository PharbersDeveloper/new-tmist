import Mixin from "@ember/object/mixin"

//TODO chart config应该放入线上数据库，现在没人放，先在本地生成
export default Mixin.create( {
	chartId: "dddd",
	generateCircleChart( rowId, chartId ) {
		return {
			id: rowId,
			height: 168,
			panels: [
				{
					name: "tmcircleproduct0",
					id: chartId,
					color: ["#73ABFF", "#FFC400", "#57D9A3"],
					tooltip: {
						show: true,
						trigger: "item"
					},
					legend: {
						show: false
					},
					series: [{
						name: "",
						type: "pie",
						radius: ["50", "64"],
						avoidLabelOverlap: false,
						hoverOffset: 3,
						labelLine: {
							normal: {
								show: true
							}
						},
						label: {
							color: "#7A869A",
							formatter: "{b}  {d}%"
						}
					}]
				}
			]
		}
	}
} )
