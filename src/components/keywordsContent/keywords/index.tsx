import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import useKeywordStore from '@/stores/useKeywordStore';
import useTrendKeywordsStore from '@/stores/useTrendKeywordsStore';
import type { KeywordData } from '@/stores/useTrendKeywordsStore';

interface KeywordsProps {
  isShifted?: boolean;
}

const Keywords = ({ isShifted = false }: KeywordsProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const setSelectedKeyword = useKeywordStore(s => s.setSelectedKeyword);
  const keywords = useTrendKeywordsStore(s => s.keywords);
  const isLoading = useTrendKeywordsStore(s => s.isLoading);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // 30초마다 리프레시
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setRefreshKey(prev => prev + 1);
        setIsFading(false);
      }, 500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!svgRef.current || keywords.length === 0) return;

    const width = 800;
    const height = 600;

    d3.select(svgRef.current).selectAll('*').remove();

    const maxValue = Math.max(...keywords.map(d => d.value));
    const minValue = Math.min(...keywords.map(d => d.value));
    const fontScale = d3.scaleLinear().domain([minValue, maxValue]).range([10, 70]);

    const colors = [
      '#6B4EFF',
      '#8257B4',
      '#9F8CFF',
      '#634DCB',
      '#A594F9',
      '#4F378A',
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#FF8C00',
      '#20B2AA',
      '#9370DB',
      '#3CB371',
      '#FF69B4',
      '#00CED1',
    ];

    const layout = cloud<KeywordData & cloud.Word>()
      .size([width, height])
      .words(keywords.map(d => ({ ...d, size: fontScale(d.value) })))
      .padding(3)
      .rotate(() => (Math.random() > 0.7 ? 90 : 0))
      .font('Pretendard')
      .fontSize(d => d.size || 12)
      .on('end', words => {
        const svg = d3
          .select(svgRef.current)
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        svg
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', d => `${d.size}px`)
          .style('font-family', 'Pretendard')
          .style('font-weight', '600')
          .style('fill', () => colors[Math.floor(Math.random() * colors.length)])
          .style('cursor', 'pointer')
          .style('opacity', 0)
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
          .text(d => d.text || '')
          .transition()
          .duration(800)
          .delay((_, i) => i * 1)
          .style('opacity', 1);

        // 호버 효과 + 클릭 이벤트
        svg.selectAll('text').on('click', function () {
          const d = d3.select(this).datum() as KeywordData & cloud.Word;
          setSelectedKeyword({ text: d.text || '', value: d.value });
        });
      });

    layout.start();
  }, [keywords, setSelectedKeyword, refreshKey]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-[800px] h-[600px]">
        <div className="text-gray-400 animate-loading-pulse typo-body3">
          트렌드 키워드를 불러오는 중...
        </div>
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="flex items-center justify-center w-[800px] h-[600px]">
        <div className="text-gray-400 typo-body3">키워드 데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center transition-all duration-500 ease-in-out ${isShifted ? '-translate-x-20' : 'translate-x-0'} ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <svg ref={svgRef} />
    </div>
  );
};

export default Keywords;
