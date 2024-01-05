import {RiShoppingBagFill} from 'react-icons/ri'
import {MdLocationOn} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsList: [],
    inputSearch: '',
    employmentList: [],
    selectedSalary: '',
  }

  componentDidMount = () => {
    this.getProfileDetails()
    this.getJobsList()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileDetailsUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileDetailsUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileDetails: updatedProfileData,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const {employmentList, selectedSalary, inputSearch} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentList.join(
      ',',
    )}&minimum_package=${selectedSalary}&search=${inputSearch}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      console.log(jobsUrl)
      console.log(updatedJobsData)
      this.setState({
        jobsApiStatus: apiStatusConstants.success,
        jobsList: updatedJobsData,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  onEmploymentChange = event => {
    const {employmentList} = this.state
    const selectedValue = event.target.value
    if (employmentList.includes(selectedValue)) {
      const updatedEmploymentList = employmentList.filter(
        eachVal => eachVal !== selectedValue,
      )
      this.setState({employmentList: updatedEmploymentList}, this.getJobsList)
    } else {
      this.setState(
        prevState => ({
          employmentList: [...prevState.employmentList, selectedValue],
        }),
        this.getJobsList,
      )
    }
  }

  onSalaryChange = event => {
    this.setState({selectedSalary: event.target.value}, this.getJobsList)
    console.log(event.target.value)
  }

  onChangeSearch = event => {
    this.setState({inputSearch: event.target.value})
  }

  onSearchClick = () => {
    this.getJobsList()
  }

  onRetryJobs = () => {
    this.getJobsList()
  }

  // profile related details
  renderProfileLoader = () => (
    <div className="loader-profile-con">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderProfileSuccess = () => {
    const {profileDetails} = this.state
    const {name, shortBio, profileImageUrl} = profileDetails

    return (
      <div className="success-profile-con">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-head">{name}</h1>
        <p className="profile-para">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="loader-profile-con">
      <button
        className="profile-btn"
        type="button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProfileLoader()
      case apiStatusConstants.success:
        return this.renderProfileSuccess()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  renderFilterContent = () => {
    const {selectedSalary} = this.state

    return (
      <div className="jobs-con1">
        {this.renderProfile()}
        <hr />
        <h1 className="filter-head">Type of Employment</h1>
        <ul className="employ-lists" onChange={this.onEmploymentChange}>
          {employmentTypesList.map(eachEmploy => (
            <li key={eachEmploy.employmentTypeId} className="employ-item">
              <input
                type="checkbox"
                name={eachEmploy.label}
                id={eachEmploy.label}
                value={eachEmploy.employmentTypeId}
              />
              <label className="input-custom" htmlFor={eachEmploy.label}>
                {eachEmploy.label}
              </label>
            </li>
          ))}
        </ul>
        <hr />
        <h1 className="filter-head">Salary Range</h1>
        <ul className="employ-lists">
          {salaryRangesList.map(eachSalary => (
            <li key={eachSalary.salaryRangeId} className="employ-item">
              <input
                type="radio"
                name={eachSalary.label}
                id={eachSalary.label}
                value={eachSalary.salaryRangeId}
                onChange={this.onSalaryChange}
                checked={eachSalary.salaryRangeId === selectedSalary}
              />
              <label className="input-custom" htmlFor={eachSalary.label}>
                {eachSalary.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobsLoader = () => (
    <div className="job-loader-con">
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  renderJobsFailure = () => (
    <div className="job-loader-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-head">Oops! Something Went Wrong</h1>
      <p className="fail-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="profile-btn" type="button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  renderJobCard = jobData => {
    const {
      id,
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData

    return (
      <li key={id} className="job-list-item">
        <Link to={`/jobs/${id}`} className="job-link">
          <div className="company-con">
            <img src={companyLogoUrl} alt="company logo" className="logo" />
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
          <h1 className="desc-head">Description</h1>
          <p className="desc-para">{jobDescription}</p>
        </Link>
      </li>
    )
  }

  renderJobsSuccess = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="job-loader-con">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="fail-img"
          />
          <h1 className="fail-head">No Jobs Found</h1>
          <p className="fail-para">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <ul className="jobs-list-con">
        {jobsList.map(job => this.renderJobCard(job))}
      </ul>
    )
  }

  renderJobsContent = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobsLoader()
      case apiStatusConstants.failure:
        return this.renderJobsFailure()
      case apiStatusConstants.success:
        return this.renderJobsSuccess()
      default:
        return null
    }
  }

  render() {
    const {inputSearch} = this.state

    return (
      <>
        <Header />
        <div className="jobs-main-con">
          {this.renderFilterContent()}
          <div className="jobs-con2">
            <div className="search-con">
              <input
                placeholder="Search"
                type="search"
                value={inputSearch}
                className="search-input"
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                aria-label="search button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onSearchClick}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsContent()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
