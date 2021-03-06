# frozen_string_literal: true

require 'gulp_assets'

# CA Intake Application Controller.
class ApplicationController < ActionController::Base # :nodoc:
  before_action :set_cache_headers
  include GulpAssets::Helper
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :gulp_asset_path

  private

  def authenticate_user
    session.delete(:security_token) if security_token
    return if session[:security_token]

    if SecurityRepository.token_valid?(security_token)
      session[:security_token] = security_token
    else
      redirect_to SecurityRepository.login_url(request.original_url)
    end
  end

  def security_token
    params[:token]
  end

  def authentication_enabled?
    Feature.active?(:authentication)
  end

  def set_cache_headers
    response.headers['Cache-Control'] = 'no-cache, no-store'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1'
  end
end
