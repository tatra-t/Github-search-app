"use strict";

// DOM variables
const container = document.querySelector(".searchContainer");
const searchUserInput = document.querySelector(".searchUser");
const profile = document.querySelector(".profile");
const repository = document.querySelector(".repos");
class API {
  clientId = "aa5ad311b262cc778772";
  clientSecret = "a11c85334b90681cdd0a41783f5f449d3d681885";

  async getUser(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(this.clientId + ":" + this.clientSecret)}`
      }
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  async getRepo(userText) {
  const repo = await fetch(`https://api.github.com/users/${userText}/repos?sort=created&per_page=5`, {
       method: "GET",
       headers: {
         Authorization: `Basic ${btoa(this.clientId + ":" + this.clientSecret)}`,
       },
    });
    const repos = await repo.json();
    return repos;

    
  }
}

class UI {
  showProfile(user, userRepo) {
    console.log(userRepo);
    repository.innerHTML ="";
    
    profile.innerHTML = `
    <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
    `;
    
    for (let i=0; i<userRepo.length; i++) {
      let newLine = document.createElement("li");
      newLine.innerHTML = `<a href="${userRepo[i].html_url}">${userRepo[i].name}</a> `;
      repository.prepend(newLine);
     }
  }
  clearProfile() {
    profile.innerHTML = "";
  }

  showAlert(message, type, timeout = 3000) {
    this.clearAlert();

    const div = document.createElement("div");
    div.className = `alert ${type}`;
    div.appendChild(document.createTextNode(message));

    const search = document.querySelector(".search");
    container.insertBefore(div, search);

    setTimeout(() => {
      this.clearAlert();
    }, timeout);
  }

  clearAlert() {
    const alertBlock = document.querySelector(".alert");
    if (alertBlock) {
      alertBlock.remove();
    }
  }
}

const handleInput = async (event) => {
  const ui = new UI();
  const userText = event.target.value.trim();

  if (!userText) {
    ui.clearProfile();
    return;
  }

  try {
    const api = new API();
    const user = await api.getUser(userText);
    const repoUser = await api.getRepo(userText);
    // ui.clearAlert();
    ui.showProfile(user, repoUser);
  
  } catch (error) {
    ui.showAlert(error.message, "alert-danger");
    ui.clearProfile();
  }
};

const debounce = (func, delay) => {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Event listeners
searchUserInput.addEventListener("input", debounce(handleInput, 1000));

/*<ul class="repo-group">
          <li class="repo-group-item"><a href="${userRepo[0].html_url}"> ${userRepo[0].name}</a></li>
          <li class="repo-group-item"><a href="${userRepo[1].html_url}"> ${userRepo[1].name}</a></li>
          <li class="repo-group-item"><a href="${userRepo[2].html_url}"> ${userRepo[2].name}</a></li>
          <li class="repo-group-item"><a href="${userRepo[3].html_url}"> ${userRepo[3].name}</a></li>
          <li class="repo-group-item"><a href="${userRepo[4].html_url}"> ${userRepo[4].name}</a></li>
        </ul>*/