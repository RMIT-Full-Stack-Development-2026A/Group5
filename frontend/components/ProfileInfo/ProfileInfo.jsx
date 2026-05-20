export default function ProfileInfo() {
    return (
        <div className="col-lg-9">
            <div className="card border border-dark rounded-3">
                <div className="card-body d-flex flex-column gap-3">
                    <h2 className="card-title text-center">Profile Information</h2>
                    <div className="text-center">
                        <div className="bg-secondary rounded-circle d-inline-block" style={{ width: '100px', height: '100px' }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input type="text" placeholder="Enter your name" id="name" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" placeholder="Enter your email" id="email" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" placeholder="Enter your password" id="password" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword" className="form-label">Confirm Password:</label>
                        <input type="password" placeholder="Confirm your password" id="confirmpassword" className="form-control" />
                    </div>
                    <button className="btn">Save Changes</button>
                </div>
            </div>
        </div>
    );
}