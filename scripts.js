// Wait for DOM load
document.addEventListener("DOMContentLoaded", () => {
    const hero = document.getElementById("hero");
    const barSection = document.getElementById("bar-chart-section");
    let chartCreated = false;
  
    // IntersectionObserver to trigger hero fade and chart creation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hero.style.opacity = 0;
          if (!chartCreated) {
            createScrollDrivenBarChart();
            chartCreated = true;
          }
        } else {
          hero.style.opacity = 1;
        }
      });
    }, { threshold: 0.5 });
  
    observer.observe(barSection);
  
    // Create D3 bar chart and attach scroll event
    function createScrollDrivenBarChart() {
      const data = [
        { gender: "Men",   value: 1     },
        { gender: "Women", value: 0.811 }
      ];
      const width  = 500,
            height = 300,
            margin = { top: 60, right: 20, bottom: 40, left: 140 };
  
      const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("font-family", "sans-serif");
  
      const x = d3.scaleLinear()
        .domain([0, 1])
        .range([margin.left, width - margin.right]);
  
      const y = d3.scaleBand()
        .domain(data.map(d => d.gender))
        .range([margin.top, height - margin.bottom])
        .padding(0.4);
  
      // Y-axis
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll("text").attr("font-size", "16px").attr("font-weight", "bold"));
  
      // Bars initialized at zero width
      const bars = svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
          .attr("x", margin.left)
          .attr("y", d => y(d.gender))
          .attr("height", y.bandwidth())
          .attr("width", 0)
          .attr("fill", d => d.gender === "Men" ? "#667eea" : "#fe6b8b");
  
      // Scroll event drives bar width
      window.addEventListener("scroll", () => {
        const rect = barSection.getBoundingClientRect();
        const progress = Math.min(Math.max(1 - rect.top / window.innerHeight, 0), 1);
        bars.attr("width", d => (x(d.value) - margin.left) * progress);
      });
    }
  });