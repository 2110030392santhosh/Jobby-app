import {RiShoppingBagFill} from 'react-icons/ri'
import {MdLocationOn, MdLaunch} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'
import '../Jobs/index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemData: {},
    similarJobs: [],
    jobDetailsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getJobDetailsApi()
  }

  getJobDetailsApi = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const jobDetailsUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobDetailsUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedJobItemData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills,
        title: data.job_details.title,
      }
      const updatedSimilarJobsData = data.similar_jobs.map(eachSimi => ({
        companyLogoUrl: eachSimi.company_logo_url,
        employmentType: eachSimi.employment_type,
        id: eachSimi.id,
        jobDescription: eachSimi.job_description,
        location: eachSimi.location,
        rating: eachSimi.rating,
        title: eachSimi.title,
      }))
      console.log(updatedJobItemData)
      this.setState({
        jobItemData: updatedJobItemData,
        similarJobs: updatedSimilarJobsData,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  onRetryJobItem = () => [this.getJobDetailsApi()]

  renderJobDetailsLoader = () => (
    <div className="details-main-con">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderJobDetails = () => {
    const {jobItemData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobItemData

    const skillsList = Array.isArray(skills) ? (
      <ul className="skills-list-con">
        {skills.map(eachSkill => (
          <li key={eachSkill.name} className="skill-list-item">
            <img
              src={eachSkill.image_url}
              alt={eachSkill.name}
              className="skill-img"
            />
            <p className="skill-para">{eachSkill.name}</p>
          </li>
        ))}
      </ul>
    ) : null

    return (
      <div className="job-item-con">
        <div className="company-con">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="logo"
          />
          <div className="company-con-sub">
            <h1 className="company-head">{title}</h1>
            <div className="rating-con">
              <FaStar className="star-img" />
              <p className="rating-para">{rating}</p>
            </div>
          </div>
        </div>
        <div className="company-details-con">
          <div className="card">
            <div className="sub-card">
              <MdLocationOn className="location-logo" />
              <p className="location-para">{location}</p>
            </div>
            <div className="sub-card">
              <RiShoppingBagFill className="location-logo" />
              <p className="location-para">{employmentType}</p>
            </div>
          </div>
          <p className="salary-para">{packagePerAnnum}</p>
        </div>
        <hr className="hr-custom" />
        <div className="desc-item-con">
          <h1 className="desc-head">Description</h1>
          <a href={companyWebsiteUrl} className="anchor-custom">
            Visit <MdLaunch className="launch-icon" />
          </a>
        </div>
        <p className="desc-para">{jobDescription}</p>
        <div className="skills-con">
          <h1 className="desc-head">Skills</h1>
          {skillsList}
        </div>
        {typeof lifeAtCompany === 'object' && (
          <div className="com-life-con">
            <div className="com-life-card">
              <h1 className="desc-head">Life at Company</h1>
              <p className="desc-para">{lifeAtCompany.description}</p>
            </div>
            <img
              src={lifeAtCompany.image_url}
              alt="life at company"
              className="com-life-img"
            />
          </div>
        )}
      </div>
    )
  }

  renderSimilarJobs = simJobData => {
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      id,
      location,
      rating,
      title,
    } = simJobData

    return (
      <li key={id} className="sim-job-card">
        <div className="company-con">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="logo"
          />
          <div className="company-con-sub">
            <h1 className="company-head">{title}</h1>
            <div className="rating-con">
              <FaStar className="star-img" />
              <p className="rating-para">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="desc-head">Description</h1>
        <p className="desc-para">{jobDescription}</p>
        <div className="card card-extra">
          <div className="sub-card">
            <MdLocationOn className="location-logo" />
            <p className="location-para">{location}</p>
          </div>
          <div className="sub-card">
            <RiShoppingBagFill className="location-logo" />
            <p className="location-para">{employmentType}</p>
          </div>
        </div>
      </li>
    )
  }

  renderDetails = () => {
    const {similarJobs} = this.state

    return (
      <div className="details-main-con">
        {this.renderJobDetails()}
        <h1 className="simi-job-main-head">Similar Jobs</h1>
        <ul className="sim-jobs-lists">
          {similarJobs.map(eachSimJob => this.renderSimilarJobs(eachSimJob))}
        </ul>
      </div>
    )
  }

  renderJobItemFailure = () => (
    <div className="details-main-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-head">Oops! Something Went Wrong</h1>
      <p className="fail-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="profile-btn"
        type="button"
        onClick={this.onRetryJobItem}
      >
        Retry
      </button>
    </div>
  )

  renderFinal = () => {
    const {jobDetailsApiStatus} = this.state

    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobDetailsLoader()
      case apiStatusConstants.success:
        return this.renderDetails()
      case apiStatusConstants.failure:
        return this.renderJobItemFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderFinal()}
      </>
    )
  }
}

export default JobItemDetails
