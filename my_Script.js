// Create Dataset: Unemployment
const data = [
    {"year": 2009,     "unemployment": 9.25},
    {"year": 2010,     "unemployment": 9.63},
    {"year": 2011,     "unemployment": 8.95},
    {"year": 2012,     "unemployment": 8.07},
    {"year": 2013,     "unemployment": 7.38},
    {"year": 2014,     "unemployment": 6.17},
    {"year": 2015,     "unemployment": 5.28},
    {"year": 2016,     "unemployment": 4.87},
    {"year": 2017,     "unemployment": 4.36},
    {"year": 2018,     "unemployment": 3.90},
    {"year": 2019,     "unemployment": 3.67},
    {"year": 2020,     "unemployment": 8.31},
]

const f = d3.f
const sel = d3.select("#chart_1").html("")

let c = d3.conventions({
    parent_Select: sel,
    totalWidth: sel.node().offsetwidth,
    height: 400,
    margin: {left: 50, right: 50, top: 30, bottom: 30}
})

c.svg.append("rect")
    .at({width: c.width, height: c.height, opacity: 0})

c.x.domain([2009, 2020])
c.y.domain([0, 15])
c.xAxis.ticks(6).tickFormat(f())
c.yAxis.ticks(5).tickFormat(d => d + "%")

const area = d3.area()
    .x(f("year", c.x))
    .y(f("unemployment", c.y)).y1(c.height)
const line = d3.area()
    .x(f("year", c.x))
    .y(f("unemployment", c.y))

let clip_Rectangle = c.svg
    .append("clipPath#clip")
    .append("rect")
    .at({width: c.x(2017) - 2, height: c.height})

const correct_Selection = c.svg.append("g").attr("clip-path", "url(#clip")

correct_Selection.append("path.area").at({d: area(data)})
correct_Selection.append("path.line").at({d: line(data)})
user_Selection = c.svg.append("path.your-line")

c.drawAxis()

yourData = data
    .map(function(d){
        return {year: d.year, unemployment: d.unemployment, defined: 0} 
    })
    .filter(function(d) {
        if (d.year == 2016) 
            d.defined = true
        return d.year >= 2017
    })

let completed = false

let drag = d3.drag()
    .on("drag", function() {
        const position     = d3.mouse(this)
        const year         = clamp(2017, 2020, c.x.invert(position[0]))
        const unemployment = clamp(0, c.y.domain()[1], c.y.invert(position[1]))
        
    yourData.forEach(function(d) {
        if (Math.abs(d.year - year) < 0.5) {
            d.unemployment = unemployment
            d.defined      = true
        }
    })

    user_Selection.at({d: line.defined(f("defined"))(yourData)})
    
    if (!completed && d3.mean(yourData, f("defined")) == 1) {
        completed = true
        clip_Rectangle.transition().duration(2500).attr("width", c.x(2020))
    }
})

c.svg.call(drag)

function clamp(a, b, c) {
    return Math.max(a, Math.min(b, c))
}