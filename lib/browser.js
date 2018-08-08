'use strict'
import axios from './axios'
const defaultInstance = axios.default

Object.assign(defaultInstance, axios)

delete defaultInstance.default

export default defaultInstance
