import * as React from 'react';
import { connect } from 'react-redux';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  VictoryAnimation,
} from 'victory';
import moment from 'moment';
import { median } from 'd3';

const LabelPositionMap = {
  '/shootingsbydate': {
    2015: 240,
    2016: 325,
  },
  '/shootingsbydate/black': {
    2015: 215,
    2016: 350,
  },
  '/shootingsbydate/latino': {
    2015: 120,
    2016: 280,
  },
  '/shootingsbydate/asian': {
    2015: 45,
    2016: 255,
  },
};

const DelayMap = {
  '/shootingsbydate': 2000,
  '/shootingsbydate/black': 0,
  '/shootingsbydate/latino': 0,
  '/shootingsbydate/asian': 0,
};

class Line extends React.Component {
  render() {
    const { maps: { shootingsByDate }, router } = this.props;
    const [stats2015, stats2016] = shootingsByDate;
    const labelPosition = LabelPositionMap[router.route];
    const delay = DelayMap[router.route];
    console.log(
      stats2015 && median(stats2015.concat(stats2016).map(({ y }) => y))
    );
    return (
      <VictoryChart
        width={1000}
        height={400}
        padding={40}
        domainPadding={{ y: 20 }}
      >
        <VictoryAxis
          scale="time"
          tickValues={[
            new Date(2014, 12, 1),
            new Date(2015, 2, 1),
            new Date(2015, 5, 1),
            new Date(2015, 8, 1),
            new Date(2015, 11, 1),
          ]}
          tickFormat={t => moment(t).format('MMMM')}
          label="Month"
        />
        <VictoryAxis dependentAxis label="Number of Shootings" />
        <VictoryLine
          data={stats2015}
          scale="time"
          style={{
            data: {
              stroke: '#7B52A1',
            },
          }}
          animate={{
            onEnter: {
              duration: 2000,
            },
          }}
        />
        <VictoryAnimation
          data={[{ fill: 'transparent' }, { fill: '#7B52A1' }]}
          delay={delay}
        >
          {style => (
            <VictoryLabel
              x={950}
              y={labelPosition ? labelPosition['2015'] : 240}
              text="2015"
              style={style}
            />
          )}
        </VictoryAnimation>
        <VictoryLine
          data={stats2016}
          scale="time"
          style={{
            data: {
              stroke: '#9FA152',
            },
          }}
          animate={{
            onEnter: {
              duration: 2000,
            },
            delay,
          }}
        />
        <VictoryAnimation
          data={[{ fill: 'transparent' }, { fill: '#9FA152' }]}
          delay={delay + 1000}
        >
          {style => (
            <VictoryLabel
              x={950}
              y={labelPosition ? labelPosition['2016'] : 325}
              text="2016"
              style={style}
            />
          )}
        </VictoryAnimation>
      </VictoryChart>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    maps: state.mapReducer,
    router: state.router,
  };
};

export default connect(mapStateToProps)(Line);
