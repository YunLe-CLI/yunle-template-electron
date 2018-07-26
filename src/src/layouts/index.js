import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import './style.less'

export default class PageWrapper extends React.PureComponent {
	render() {
		const { children } = this.props;
		return (
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				padding: 0,
				overflow: 'hidden',
			}}>
				<Helmet
					title="YunLe.AI"
				/>
				{children()}
			</div>
		);
	}
}

PageWrapper.propTypes = {
	children: PropTypes.func,
}

